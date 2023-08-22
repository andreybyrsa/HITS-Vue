<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import {
  RoleModalProps,
  RoleModalEmits,
} from '@Components/Modals/RoleModal/RoleModal.types'

import RolesTypes from '@Domain/Roles'

import useUserStore from '@Store/user/userStore'

import getRoles from '@Utils/getRoles'

defineProps<RoleModalProps>()

const emit = defineEmits<RoleModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const userRoles = getRoles()

function getTranslatedRole(currentRole: RolesTypes) {
  return userRoles.translatedRoles[currentRole]
}

function handleRole(currentRole: RolesTypes) {
  userStore.setRole(currentRole)
  emit('close-modal')
}
</script>

<template>
  <ModalLayout :is-opened="isOpened">
    <div class="role-modal p-3 rounded bg-white">
      <Typography class-name="fs-3 text-primary">Доступные роли</Typography>
      <div
        v-for="role in user?.roles"
        :key="role"
        class="w-100"
      >
        <Button
          @click="handleRole(role)"
          class-name="btn-primary w-100"
        >
          {{ getTranslatedRole(role) }}
        </Button>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.role-modal {
  &__header {
    @include flexible(center, space-between);
  }

  width: 400px;

  @include flexible(
    center,
    flex-start,
    column,
    $gap: 16px,
    $align-self: center,
    $justify-self: center
  );

  transition: all $default-transition-settings;
}

.modal-layout-enter-from .role-modal,
.modal-layout-leave-to .role-modal {
  transform: scale(0.9);
}
</style>
