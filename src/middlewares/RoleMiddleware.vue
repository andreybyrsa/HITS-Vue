<script lang="ts" setup>
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import RoleModal from '@Components/Modals/RoleModal/RoleModal.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

let isOpenedModal = ref(false)

if (user.value?.roles.length == 1) {
  isOpenedModal = ref(false)
  userStore.setRole(user.value?.roles[0])
} else {
  isOpenedModal = ref(true)
}

if (user.value?.role) {
  isOpenedModal = ref(false)
}
</script>

<template>
  <router-view />
  <RoleModal
    :is-opened="isOpenedModal"
    @close-modal="isOpenedModal = false"
  />
</template>
