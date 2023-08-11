<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

import RoleModal from '@Components/Modals/RoleModal/RoleModal.vue'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isOpenedModal = ref(false)

onMounted(() => {
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
</template>
