<script lang="ts" setup>
import { ref, computed } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import { ProfileSkillProps } from '@Components/Modals/ProfileModal/ProfileModal.types'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import StackCategories from '@Components/StackCategories/StackCategories.vue'
import SkillsRadarCharts from '@Components/Forms/TeamForm/SkillsRadarCharts.vue'

import { Skill } from '@Domain/Skill'

import ProfileService from '@Services/ProfileService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const props = defineProps<ProfileSkillProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const profileSkills = ref<Skill[]>([])
const selectedSkills = ref<Skill[]>([])

const isOwnProfile = computed(() => props.profile.email === user.value?.email)
const isUpdatingSkills = ref(false)

watchImmediate(
  () => props.profile.skills,
  (skills) => {
    profileSkills.value = skills
  },
)

function toogleUpdatingSkills(value: boolean) {
  isUpdatingSkills.value = value
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
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    toogleUpdatingSkills(false)
    profileSkills.value = selectedSkills.value
  }
}
</script>

<template>
  <div class="w-100 bg-white border p-3 rounded-4">
    <div class="header border-bottom pb-1">
      <Typography class-name="fs-4 text-primary">Компетенции</Typography>
      <Button
        v-if="!isUpdatingSkills && isOwnProfile"
        variant="light"
        @click="toogleUpdatingSkills(true)"
      >
        Изменить стек
      </Button>

      <div
        class="d-flex gap-2"
        v-if="isUpdatingSkills"
      >
        <Button
          variant="primary"
          @click="handleSaveSkills"
        >
          Сохранить
        </Button>
        <Button
          variant="danger"
          @click="toogleUpdatingSkills(false)"
        >
          Отменить
        </Button>
      </div>
    </div>

    <div class="content p-2">
      <StackCategories
        v-if="isUpdatingSkills"
        :skills="profileSkills"
        v-model:stack="selectedSkills"
      />

      <SkillsRadarCharts
        v-else
        :skills="profileSkills"
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
