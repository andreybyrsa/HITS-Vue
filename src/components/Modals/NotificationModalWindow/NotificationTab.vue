<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDateFormat } from '@vueuse/core'

import Typography from '@Components/Typography/Typography.vue'
import { NotificationTabProps } from '@Components/Modals/NotificationModalWindow/NotificationModalWindow.types'

import Notification from '@Domain/Notification'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import Button from '@Components/Button/Button.vue'

const props = defineProps<NotificationTabProps>()

const notificationsStore = useNotificationsStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const NatificationTabClassName = computed(() => {
  const { notification } = props

  return [
    'notification-tab',
    'w-100',
    'border',
    'border-primary',
    'rounded-3',
    'p-2',
    {
      'notification-tab--white': notification.isReaded,
      'notification-tab--primary': !notification.isReaded,
    },
  ]
})

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY в HH:MM')
    return formattedDate.value
  }
}

async function readNotification(notification: Notification) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    await notificationsStore.readNotification(notification.id, token)
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
  <div :class="NatificationTabClassName">
    <div class="w-100 pb-2 d-flex flex-column gap-1 border-bottom">
      <div class="w-100 d-flex gap-3 justify-content-between align-items-center">
        <Typography class-name="fw-bold">{{ notification.title }}</Typography>

        <div class="d-flex align-self-start align-items-center gap-2">
          <Typography class-name="text-secondary text-nowrap">
            {{ getFormattedDate(notification.createdAt) }}
          </Typography>

          <Button
            v-if="!notification.isReaded"
            variant="outline-primary"
            class-name="p-2"
            prepend-icon-name="bi bi-check-lg fs-6"
            @click="readNotification(notification)"
          />
          <Button
            v-if="notification.isFavourite"
            variant="outline-warning"
            class-name="p-2"
            prepend-icon-name="bi bi-bookmark-fill fs-6"
            @click="removeFromFavorites(notification)"
          />
          <Button
            v-else
            variant="outline-warning"
            class-name="px-2 py-2"
            prepend-icon-name="bi bi-bookmark fs-6"
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
  &--white {
    background-color: $white-color;
  }

  &--primary {
    background-color: rgba($primary-color, 0.05);
  }
}
</style>
