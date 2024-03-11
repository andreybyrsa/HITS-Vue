<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { RolesTypes } from '@Domain'
import { useUserStore } from '@Store'
import { getUserRolesInfo, getRouteByUserRole } from '@Utils'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import {
  RoleModalProps,
  RoleModalEmits,
} from '@Components/Modals/RoleModal/RoleModal.types'

defineProps<RoleModalProps>()

const emit = defineEmits<RoleModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()
const route = useRoute()

const userRoles = getUserRolesInfo()

function getTranslatedRole(currentRole: RolesTypes) {
  return userRoles.translatedRoles[currentRole]
}

function handleChooseRole(currentRole: RolesTypes) {
  userStore.setRole(currentRole)

  const requiredRouteRoles = route.meta?.roles ?? []

  if (requiredRouteRoles.length && !requiredRouteRoles.includes(currentRole)) {
    router.push(getRouteByUserRole(currentRole))
  }

  emit('close-modal')
}
</script>

<template>
  <ModalLayout :is-opened="isOpened">
    <div class="role-modal p-3 rounded bg-white">
      <Typography class-name="fs-3 text-primary text-center">
        Доступные роли
      </Typography>
      <Button
        v-for="role in user?.roles"
        :key="role"
        variant="primary"
        @click="handleChooseRole(role)"
      >
        {{ getTranslatedRole(role) }}
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.role-modal {
  width: 400px;

  @include flexible(
    stretch,
    stretch,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  transition: all $default-transition-settings;
}

.modal-layout-enter-from .role-modal,
.modal-layout-leave-to .role-modal {
  transform: scale(0.9);
}
</style>
