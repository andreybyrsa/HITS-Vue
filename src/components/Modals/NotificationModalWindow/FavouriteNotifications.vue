<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import NotificationTab from '@Components/Modals/NotificationModalWindow/NotificationTab.vue'
import Typography from '@Components/Typography/Typography.vue'

import Notification from '@Domain/Notification'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()
const { notifications } = storeToRefs(notificationsStore)

async function removeFromFavorites(notification: Notification) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    await notificationsStore.unMarkAsFavoriteNotification(notification.id, token)
  }
}
</script>

<template>
  <div
    v-if="notifications.length"
    class="w-100 d-flex flex-column gap-3"
  >
    <NotificationTab
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
      is-favourite
      @icon-click="removeFromFavorites"
    />
  </div>

  <Typography
    v-else
    class-name="w-100 text-center p-3 text-secondary text-wrap"
  >
    Добавляйте в избранное важные уведомления
  </Typography>
</template>
