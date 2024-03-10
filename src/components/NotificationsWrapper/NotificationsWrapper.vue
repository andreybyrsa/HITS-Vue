<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { Notification } from '@Domain'
import { useNotificationsStore } from '@Store'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

const notificationsStore = useNotificationsStore()
const { notifications, systemNotifications } = storeToRefs(notificationsStore)

function closeSystemNotification(notification: Notification) {
  notificationsStore.closeSystemNotification(notification.id)
}

async function closeNotification(notification: Notification) {
  await notificationsStore.closeNotification(notification.id)
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
