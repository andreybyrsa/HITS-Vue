<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import NotificationTab from '@Components/Modals/NotificationModalWindow/NotificationTab.vue'

import useNotificationsStore from '@Store/notifications/notificationsStore'

const notificationsStore = useNotificationsStore()
const { getReadedNotifications } = storeToRefs(notificationsStore)
</script>

<template>
  <div class="w-100 d-flex flex-column">
    <Typography class-name="fs-5 text-primary text-wrap">
      Прочитано ({{ getReadedNotifications.length }})
    </Typography>

    <Typography
      v-if="!getReadedNotifications.length"
      class-name="w-100 text-center text-secondary"
    >
      У вас нет прочитанных уведомлений
    </Typography>
  </div>

  <NotificationTab
    v-for="notification in getReadedNotifications"
    :key="notification.id"
    :notification="notification"
    :is-favourite="notification.isFavourite"
  />
</template>
