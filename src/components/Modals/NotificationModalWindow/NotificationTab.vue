<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useDateFormat } from '@vueuse/core'

import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import { NotificationTabProps } from '@Components/Modals/NotificationModalWindow/NotificationModalWindow.types'

import Notification from '@Domain/Notification'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

defineProps<NotificationTabProps>()

const notificationsStore = useNotificationsStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY в HH:MM')
    return formattedDate.value
  }
}

async function addToFavorites(notification: Notification) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    await notificationsStore.markAsFavoriteNotification(notification.id, token)
  }
}

async function removeFromFavorites(notification: Notification) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    await notificationsStore.unMarkAsFavoriteNotification(notification.id, token)
  }
}
</script>

<template>
  <div class="notification-tab w-100 border border-primary bg-white rounded-3 p-2">
    <div class="w-100 pb-2 d-flex flex-column gap-1 border-bottom">
      <div class="w-100 d-flex gap-3 justify-content-between align-items-start">
        <Typography class-name="fw-bold">{{ notification.title }}</Typography>

        <div class="notification-tab__date d-flex gap-2">
          <Typography class-name="text-secondary">
            {{ getFormattedDate(notification.createdAt) }}
          </Typography>

          <Icon
            v-if="isFavourite"
            class-name="bi bi-bookmark-fill fs-5 text-warning cursor-pointer"
            @click="removeFromFavorites(notification)"
          />
          <Icon
            v-else
            class-name="bi bi-bookmark fs-5 text-warning cursor-pointer"
            @click="addToFavorites(notification)"
          />
        </div>
      </div>
    </div>

    <div class="w-100 pt-2">
      <Typography>{{ notification.message }}</Typography>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notification-tab {
  &__date {
    @include fixedWidth(170px);
  }
}
</style>
