<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMagicKeys } from '@vueuse/core'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import {
  InviteModalEmits,
  InviteModalProps,
} from '@Components/Modals/InviteModal/InviteModal.types'

import { User } from '@Domain/User'

import useUserStore from '@Store/user/userStore'

import ManageUsersService from '@Services/ManageUsersService'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
defineProps<InviteModalProps>()

const emit = defineEmits<InviteModalEmits>()

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const { enter } = useMagicKeys()

watch(enter, () => {
  emit('close-modal')
})

const allUsers = ref<User[]>([])

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await ManageUsersService.getUsers(token)

    if (response instanceof Error) {
      return
    }
    allUsers.value = response
  }
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="invite-modal p-3 rounded bg-white">
      <div v-if="allUsers">
        <Combobox
          name="inviteUser"
          :options="allUsers"
          :display-by="['email', 'firstName', 'lastName']"
          no-form-controlled
          placeholder="Выберите пользователя"
        ></Combobox>
      </div>
      <div v-else>
        <LoadingPlaceholder height="small"></LoadingPlaceholder>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.invite-modal {
  @include flexible(
    center,
    flex-end,
    column,
    $gap: 16px,
    $align-self: center,
    $justify-self: center
  );
}
</style>
