<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { watchImmediate } from '@vueuse/core'

import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import Typography from '@Components/Typography/Typography.vue'
import {
  StackCategoriesProps,
  comboboxStackCategories,
} from '@Components/StackCategories/StackCategories'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import Skills from '@Components/Skills/Skills.vue'
import Icon from '@Components/Icon/Icon.vue'
import { Skill, SkillType } from '@Domain/Skill'

import SkillsService from '@Services/SkillsService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const props = defineProps<StackCategoriesProps>()

const stackValue = defineModel<Skill[]>('stack', {
  required: false,
})
const stackByTypes = defineModel<Record<SkillType, Skill[]>>('stackByTypes', {
  required: false,
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const skills = ref<Record<SkillType, Skill[]>>()

const choosenSkills = ref<Record<SkillType, Skill[]>>({
  LANGUAGE: [],
  FRAMEWORK: [],
  DATABASE: [],
  DEVOPS: [],
})

onMounted(async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await SkillsService.getAllConfirmedOrCreatorSkills(token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    skills.value = response
  }
})

watchImmediate(
  () => props.skills,
  () => {
    if (props.skills) {
      Object.keys(choosenSkills.value).forEach((key) => {
        if (props.skills) {
          choosenSkills.value[key as SkillType] = props.skills.filter(
            (skill) => skill.type === key,
          )
        }
      })
    }
  },
)

watchImmediate(
  choosenSkills,
  (currentSkills) => {
    let currentStack: Skill[] = []
    Object.values(currentSkills).forEach((skills) => currentStack.push(...skills))

    stackValue.value = currentStack
    stackByTypes.value = currentSkills
  },
  { deep: true },
)

function unselectTechnology(skill: Skill, index: number) {
  choosenSkills.value[skill.type].splice(index, 1)
}

function checkIsChoosenSkills() {
  const { LANGUAGE, FRAMEWORK, DATABASE, DEVOPS } = choosenSkills.value
  return (
    LANGUAGE.length > 0 ||
    FRAMEWORK.length > 0 ||
    DATABASE.length > 0 ||
    DEVOPS.length > 0
  )
}

const handleAddNoConfirmedStack = async (name: string, type: SkillType) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const newSkill = { name, type, confirmed: false } as Skill
    const { token } = currentUser
    const response = await SkillsService.createNoConfirmedSkill(newSkill, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    if (skills.value) {
      skills.value[type] = [...skills.value[type], response]
      choosenSkills.value[type] = [...choosenSkills.value[type], response]
    }
  }
}
</script>

<template>
  <div>
    <Typography
      class-name="text-primary"
      hint="В стеке технологий необходимо указать минимальный набор технологий, которые должны быть использованы командой для реализации. Избегайте в одной идее конкурирующих между собой технологий. Например нельзя указать одновременно MYSQL и PostgreSQL или нельзя указать одновременно VueJS и ReactJS.<br/>Желательно выбирать технологии, которыми Вы лучше всего владеете на практике и легко сможете дать оценку и консультацию команде студентов."
      >Стек технологий*
    </Typography>

    <div
      v-if="skills"
      class="stack-categories mt-2 w-100"
    >
      <div
        v-for="category in comboboxStackCategories"
        :key="category.id"
        class="w-25"
      >
        <Combobox
          :name="`stack-${category.key}`"
          :options="skills[category.key]"
          :display-by="['name']"
          comparing-key="id"
          v-model="choosenSkills[category.key]"
          no-form-controlled
          :placeholder="category.placeholder"
          :multiselect-placeholder="category.multiselectPlaceholder"
          @add-new-option="(name) => handleAddNoConfirmedStack(name, category.key)"
        />

        <div
          v-if="checkIsChoosenSkills()"
          class="mt-2"
        >
          <Skills
            :skills="choosenSkills[category.key]"
            skill-action-icon="bi bi-x-lg"
            @skill-action="unselectTechnology"
          />
        </div>
      </div>
    </div>

    <div
      v-else
      class="mt-2 w-100 d-flex gap-3"
    >
      <LoadingPlaceholder
        v-for="index in 3"
        :key="index"
        height="small"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stack-categories {
  @include flexible(flex-start, stretch, $gap: 16px);
}
</style>
