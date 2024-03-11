<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '@Store'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import NotificationTab from '@Components/Modals/NotificationModalWindow/NotificationTab.vue'

const notificationsStore = useNotificationsStore()
const { getUnreadedNotifications } = storeToRefs(notificationsStore)

const markAllAsRead = async () => {
  await notificationsStore.readAllNotifications()
}
</script>

<template>
  <div class="d-flex justify-content-between align-items-center gap-3 w-100">
    <Typography class-name="fs-5 text-primary">
      Непрочитано ({{ getUnreadedNotifications.length }})
    </Typography>

    <Button
      v-if="getUnreadedNotifications.length"
      variant="primary"
      append-icon-name="bi bi-check-all fs-4"
      @click="markAllAsRead"
    >
      Прочитать все
    </Button>
  </div>

  <div
    v-if="!getUnreadedNotifications.length"
    class="w-100 text-center text-secondary"
  >
    <Typography>У вас нет непрочитанных уведомлений</Typography>
  </div>

  <NotificationTab
    v-for="notification in getUnreadedNotifications"
    :key="notification.id"
    :notification="notification"
  />
</template>
