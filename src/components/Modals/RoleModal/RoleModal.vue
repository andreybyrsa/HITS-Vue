<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Components/Modals/ModalLayout/ModalLayout.vue'
import {
  RoleModalProps,
  RoleModalEmits,
} from '@Components/Modals/RoleModal/RoleModal.types'

import getRoles from '@Utils/getRoles'
import useUserStore from '@Store/user/userStore'
import RolesTypes from '@Domain/Roles'

defineProps<RoleModalProps>()

const emit = defineEmits<RoleModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const userRoles = getRoles()

const getTranslatedRole = (currentRole: RolesTypes) => {
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
      <div class="role-modal__header w-100">
        <Typography class="fs-3 text-primary">Доступные роли</Typography>
      </div>
      <div
        v-for="role in user?.roles"
        :key="role"
        class="w-100"
      >
        <Button
          @click="handleRole(role)"
          class-name="btn-primary w-100"
        >
          <Typography class-name="fs-3">{{
            getTranslatedRole(role)
          }}</Typography>
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
    flex-start,
    flex-start,
    column,
    $gap: 16px,
    $align-self: center,
    $justify-self: center
  );

  animation: openRoleModal $default-animation-settings;
}

@keyframes openRoleModal {
  from {
    opacity: 0;

    transform: scale(0.9);
  }
  to {
    opacity: 1;

    transform: scale(1);
  }
}
</style>
