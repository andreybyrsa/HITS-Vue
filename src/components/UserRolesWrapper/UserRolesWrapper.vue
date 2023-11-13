<script lang="ts" setup>
import { ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

import RoleModal from '@Components/Modals/RoleModal/RoleModal.vue'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()
const route = useRoute()

const isOpenedModal = ref(false)

watchImmediate(user, (currentUser) => {
  if (currentUser) {
    const { roles, role } = currentUser

    if (roles.length == 1 && !role) {
      userStore.setRole(roles[0])
    } else if (roles.length > 1 && !role) {
      isOpenedModal.value = true
    }
  }
})

watchImmediate(
  () => user.value?.role,
  (currentRole) => {
    const requiredRouteRoles = route.meta?.roles ?? []

    if (requiredRouteRoles.length && currentRole) {
      if (!requiredRouteRoles.includes(currentRole)) {
        router.push({ name: 'error' })
      }
    }
  },
)

function handleCloseModal() {
  isOpenedModal.value = false
}
</script>

<template>
  <RoleModal
    :is-opened="isOpenedModal"
    @close-modal="handleCloseModal"
  />
</template>
