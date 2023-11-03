<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref } from 'vue'

import RoleModal from '@Components/Modals/RoleModal/RoleModal.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()
const { systemNotifications } = storeToRefs(notificationsStore)

const isOpenedModal = ref(false)

onBeforeMount(() => {
  if (user.value) {
    const { roles, role } = user.value

    if (roles.length == 1 && !role) {
      userStore.setRole(roles[0])
    } else if (roles.length > 1 && !role) {
      isOpenedModal.value = true
    }
  }
})

function handleCloseModal() {
  isOpenedModal.value = false
}
</script>

<template>
  <router-view />
  <RoleModal
    :is-opened="isOpenedModal"
    @close-modal="handleCloseModal"
  />

  <NotificationModal
    v-for="notification in systemNotifications"
    :key="notification.id"
    :notification="notification"
    @close-modal="handleCloseModal"
  >
    {{ notification.message }}
  </NotificationModal>
</template>
