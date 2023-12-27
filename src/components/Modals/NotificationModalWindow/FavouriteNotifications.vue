<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import NotificationTab from '@Components/Modals/NotificationModalWindow/NotificationTab.vue'
import Typography from '@Components/Typography/Typography.vue'

import useNotificationsStore from '@Store/notifications/notificationsStore'

const notificationsStore = useNotificationsStore()
const { getFavouriteNotifications } = storeToRefs(notificationsStore)
</script>

<template>
  <div
    v-if="getFavouriteNotifications.length"
    class="w-100 d-flex flex-column gap-3"
  >
    <NotificationTab
      v-for="notification in getFavouriteNotifications"
      :key="notification.id"
      :notification="notification"
      is-favourite
    />
  </div>

  <Typography
    v-else
    class-name="w-100 text-center text-secondary"
  >
    Добавляйте в избранное важные уведомления
  </Typography>
</template>
