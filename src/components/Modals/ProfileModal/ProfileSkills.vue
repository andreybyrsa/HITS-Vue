<script lang="ts" setup>
import { ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import { ProfileSkillProps } from '@Components/Modals/ProfileModal/ProfileModal.types'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import StackCategories from '@Components/StackCategories/StackCategories.vue'
import Skills from '@Components/Skills/Skills.vue'

import { Skill } from '@Domain/Skill'

import ProfileService from '@Services/ProfileService'

import useUserStore from '@Store/user/userStore'
import SkillsRadarCharts from '@Components/Forms/TeamForm/SkillsRadarCharts.vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<ProfileSkillProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()
const route = useRoute()

const profileSkills = ref<Skill[]>()
const selectedSkills = ref<Skill[]>([])

const editSkills = ref(false)

watchImmediate(
  () => props.skills,
  (skills) => {
    profileSkills.value = skills
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

const handleSaveSkills = async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await ProfileService.saveProfileSkills(
      selectedSkills.value,
      token,
    )

    if (response instanceof Error) {
      return // notification
    }

    editSkills.value = false
    profileSkills.value = selectedSkills.value
  }
}

function handleCancelUpdating() {
  editSkills.value = false
}
</script>

<template>
  <div class="w-100 bg-white border p-3 rounded-4">
    <div class="header border-bottom pb-1">
      <Typography class-name="fs-4 text-primary">Мои компетенции</Typography>
      <Button
        v-if="editSkills === false && props.status == true"
        class-name="border bg-light "
        @click="editSkillsHandler"
      >
        Изменить стек
      </Button>
      <div
        class="d-flex"
        v-if="editSkills === true"
      >
        <Button
          class-name="border bg-primary text-light "
          @click="handleSaveSkills"
        >
          Сохранить
        </Button>
        <Button
          class-name="border bg-danger text-light "
          @click="handleCancelUpdating"
        >
          Отменить
        </Button>
      </div>
    </div>

    <div
      class="content p-2"
      v-if="editSkills === false"
    >
      <!-- <div class="content__categories flex-wrap">
        <div
          class="w-50 p-3"
          v-for="(category, index) in skillsCategories"
          :key="index"
        >
          <div class="w-100 border rounded p-3 text-center">
            <Typography class-name="fs-5">{{ category.name }}</Typography>
          </div>

          <div class="content__technologies mt-2">
            <Skills :skills="profileSkills" />
          </div>
        </div>
      </div> -->

      <SkillsRadarCharts
        v-if="profileSkills"
        :skills="profileSkills"
        class="w-100"
      ></SkillsRadarCharts>
    </div>

    <div
      v-if="editSkills === true"
      class="content p-2"
    >
      <StackCategories
        :skills="profileSkills"
        v-model:stack="selectedSkills"
      />
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
