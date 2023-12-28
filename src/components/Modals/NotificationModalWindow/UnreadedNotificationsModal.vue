<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import NotificationTab from '@Components/Modals/NotificationModalWindow/NotificationTab.vue'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import useUserStore from '@Store/user/userStore'

const notificationsStore = useNotificationsStore()
const { getUnreadedNotifications } = storeToRefs(notificationsStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const markAllAsRead = async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    await notificationsStore.readAllNotifications(token)
  }
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
