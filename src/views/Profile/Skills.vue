<script lang="ts" setup>
import { ref } from 'vue'

import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'

import ProfileSkillProps from '@Views/Profile/Skills.types'
import StackCategories from '@Components/StackCategories/StackCategories.vue'
import { Skill, SkillType } from '@Domain/Skill'
import { storeToRefs } from 'pinia'
import useUserStore from '@Store/user/userStore'
import ProfileService from '@Services/ProfileService'
import { watchImmediate } from '@vueuse/core'

const props = defineProps<ProfileSkillProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const selectedSkills = ref<Skill[]>([])

const editSkills = ref(false)

const skills = ref<Skill[]>()

watchImmediate(
  () => props.skills,
  (profileSkills) => {
    skills.value = profileSkills
  },
)

const skillsCategories = [
  { name: 'Языки разработки', type: 'LANGUAGE' },
  { name: 'Фреймворки', type: 'FRAMEWORK' },
  { name: 'Базы данных', type: 'DATABASE' },
  { name: 'DevOps технолгии', type: 'DEVOPS' },
]

function editSkillsHandler() {
  editSkills.value = true
}

function editSkillsClose() {
  editSkills.value = false
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

const handleSaveSkills = async (selectedSkills: Skill[]) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await ProfileService.saveSkills(skills.value, token)
    console.log(response)

    if (response instanceof Error) {
      return // notification
    }

    //skills.value?.push(response)
    editSkills.value = false
  }
}
</script>

<template>
  <div class="w-100 bg-white border p-3 rounded-4">
    <div class="header border-bottom pb-1">
      {{ skills }}
      {{ selectedSkills }}
      <Typography class-name="fs-4 text-primary">Мои компетенции</Typography>
      <Button
        v-if="editSkills === false"
        class-name="border bg-light "
        @click="editSkillsHandler"
        >Изменить стек</Button
      >
      <Button
        v-if="editSkills === true"
        class-name="border bg-primary text-light "
        @click="handleSaveSkills(selectedSkills)"
        >Сохранить</Button
      >
    </div>

    <div
      class="content p-2"
      v-if="editSkills == false"
    >
      <div class="content__categories flex-wrap">
        <div
          class="w-50 p-3"
          v-for="(category, index) in skillsCategories"
          :key="index"
        >
          <div class="w-100 border rounded p-3 text-center">
            <Typography class-name="fs-5">{{ category.name }}</Typography>
          </div>

          <div class="content__technologies mt-2">
            <template
              v-for="technology in skills"
              :key="technology"
            >
              <div
                v-if="technology.type === category.type"
                :class="getTechnologyClassName(technology.type)"
              >
                <Typography>{{ technology.name }}</Typography>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div
      class="content p-2"
      v-if="editSkills == true"
    >
      <StackCategories v-model:stack="skills" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content {
  width: 100%;
  @include flexible(flex-start, flex-start, column, $gap: 16px);

  &__skills {
    width: 50%;
    @include flexible(center, center);
  }

  &__categories {
    width: 100%;
    @include flexible(start, start);
  }

  &__technologies {
    @include flexible(center, flex-start, $flex-wrap: wrap, $gap: 4px);
  }
}
</style>
