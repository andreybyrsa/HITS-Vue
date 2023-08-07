<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import {
  RoleModalProps,
  RoleModalEmits,
} from '@Components/Modals/RoleModal/RoleModal.types'
import ModalLayout from '@Components/Modals/ModalLayout/ModalLayout.vue'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

defineProps<RoleModalProps>()

const emit = defineEmits<RoleModalEmits>()
</script>

<template>
  <ModalLayout :is-opened="isOpened">
    <div
      v-if="isOpened"
      class="role-modal"
    >
      <Button
        class-name="btn-close"
        @click="emit('close-modal')"
      ></Button>

      <template
        v-for="role in user?.roles"
        :key="role"
      >
        <Button class-name="btn-primary w-100">
          {{ role }}
        </Button>
      </template>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.role-modal {
  width: 400px;
  background-color: $white-color;

  @include flexible(
    $flex-direction: column,
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
