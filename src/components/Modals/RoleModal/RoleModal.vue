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
    <div class="role-modal p-3 rounded-3">
      <Button
        class-name="btn-close"
        @click="emit('close-modal')"
      ></Button>

      <Button
        v-for="role in user?.roles"
        :key="role"
        class-name="btn-primary"
      >
        {{ role }}
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.role-modal {
  width: 400px;
  background-color: $white-color;

  @include flexible($align-self: center, $justify-self: center);

  transition: all 0.3s ease;
}
</style>
