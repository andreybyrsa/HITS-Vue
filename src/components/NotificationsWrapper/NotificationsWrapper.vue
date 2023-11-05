<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

import Notification from '@Domain/Notification'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()
const { notifications, systemNotifications } = storeToRefs(notificationsStore)

function closeSystemNotification(notification: Notification) {
  notificationsStore.closeSystemNotification(notification.id)
}

async function closeNotification(notification: Notification) {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    await notificationsStore.closeNotification(notification.id, token)
  }
}
</script>

<template>
  <NotificationModal
    v-for="notification in systemNotifications"
    :key="notification.id"
    :notification="notification"
    :time-expired="8000"
    @close-notification="closeSystemNotification"
  />

  <NotificationModal
    v-for="notification in notifications"
    :key="notification.id"
    :notification="notification"
    :time-expired="10000"
    @close-notification="closeNotification"
  />
</template>
