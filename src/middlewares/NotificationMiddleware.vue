<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onBeforeMount } from 'vue'

import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

import useNotificationsStore from '@Store/notifications/notificationsStore'

const notificationsStore = useNotificationsStore()
const { systemNotifications } = storeToRefs(notificationsStore)

// onBeforeMount(() => {
//   notificationsStore.createSystemNotification(
//     'Новое уведомление',
//     'Это текст нового уведомления',
//   )
// })
</script>

<template>
  <NotificationModal
    v-for="notification in systemNotifications"
    :key="notification.id"
    :notification="notification"
    >{{ notification.message }}</NotificationModal
  >
</template>
