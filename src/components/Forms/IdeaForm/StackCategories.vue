<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import comboboxStackCategories from '@Components/Forms/IdeaForm/StackCategories'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'

import { Skill, SkillType } from '@Domain/Skill'

import SkillsService from '@Services/SkillService'

import useUserStore from '@Store/user/userStore'

const stackValue = defineModel<Skill[]>({
  required: true,
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const skills = ref<Record<SkillType, Skill[]>>()

const choosenSkills = reactive<Record<SkillType, Skill[]>>({
  LANGUAGE: stackValue.value.filter(
    (selectedValue) => selectedValue.type === 'LANGUAGE',
  ),
  FRAMEWORK: stackValue.value.filter(
    (selectedValue) => selectedValue.type === 'FRAMEWORK',
  ),
  DATABASE: stackValue.value.filter(
    (selectedValue) => selectedValue.type === 'DATABASE',
  ),
  DEVOPS: stackValue.value.filter(
    (selectedValue) => selectedValue.type === 'DEVOPS',
  ),
})

onMounted(async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await SkillsService.getAllConfirmedOrCreatorSkills(token)

    if (response instanceof Error) {
      return
    }

    skills.value = response
  }
})

watch(choosenSkills, (currentSills) => {
  let currentStack: Skill[] = []
  Object.values(currentSills).forEach((skills) => currentStack.push(...skills))

  stackValue.value = currentStack
})

function unselectTechnology(key: SkillType, index: number) {
  choosenSkills[key].splice(index, 1)
}

function getTechnologyClassName(key: SkillType) {
  const clasName = 'px-2 py-1 d-flex gap-1 bg-opacity-75 rounded text-white'

  switch (key) {
    case 'LANGUAGE':
      return clasName + ' bg-success'
    case 'FRAMEWORK':
      return clasName + ' bg-info'
    case 'DATABASE':
      return clasName + ' bg-warning'
    default:
      return clasName + ' bg-danger'
  }
}

const handleAddNoConfirmedStack = async (name: string, type: SkillType) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const newSkill: Skill = { id: '', name, type, confirmed: false }
    const { token } = currentUser
    const response = await SkillsService.addNoConfirmedSkill(newSkill, token)
    if (response instanceof Error) {
      return
    }
    if (skills.value) {
      skills.value[type].push(response)
    }
  }
}
</script>

<template>
  <div>
    <Typography class-name="text-primary">Стек технологий*</Typography>

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
          name="stack"
          :options="skills[category.key]"
          :display-by="['name']"
          v-model="choosenSkills[category.key]"
          no-form-controlled
          :placeholder="category.placeholder"
          :multiselect-placeholder="category.multiselectPlaceholder"
          @add-new-option="(name: string) => handleAddNoConfirmedStack(name, category.key)"
        />
        <div
          v-if="stackValue.length"
          class="stack-categories__technologies mt-2"
        >
          <div
            v-for="(technology, index) in choosenSkills[category.key]"
            :key="index"
            :class="getTechnologyClassName(category.key)"
          >
            <Typography>{{ technology.name }}</Typography>
            <Icon
              class-name="stack-categories__delete-technology bi bi-x-lg"
              @click="unselectTechnology(category.key, index)"
            />
          </div>
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

  &__technologies {
    @include flexible(center, flex-start, $flex-wrap: wrap, $gap: 4px);
  }

  &__delete-technology {
    cursor: pointer;
  }
}
</style>
