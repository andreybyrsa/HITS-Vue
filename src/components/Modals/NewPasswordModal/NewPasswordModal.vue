<script lang="ts" setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

import ModalLayout from '@Components/Modals/ModalLayout/ModalLayout.vue'
import { NewPasswordModalProps } from '@Components/Modals/NewPasswordModal/NewPasswordModal.types'
import newPasswordModalInputs from '@Components/Modals/NewPasswordModal/NewPasswordModalInputs'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

import { UpdateUserPassword } from '@Domain/ManageUsers'

import ManageUsersService from '@Services/ManageUsersService'

import Validation from '@Utils/Validation'
import useNotification from '@Utils/useNotification'

const props = defineProps<NewPasswordModalProps>()

const router = useRouter()

const {
  responseMessage,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

const { setValues, handleSubmit } = useForm<UpdateUserPassword>({
  validationSchema: {
    key: (value: string) => value?.length,
    email: (value: string) => Validation.checkEmail(value),
    code: (value: string) => value?.length === 6 || 'Неверно введен код',
    password: (value: string) => Validation.checkPassword(value),
  },
})

watch(
  () => props.authKey,
  () => {
    const { authKey, email } = props
    setValues({ key: authKey, email })
  },
)

const handleUpdatePassword = handleSubmit(async (values) => {
  const { success, error } = await ManageUsersService.updateUserPassword(values)

  if (success) {
    router.push('/login')
  } else {
    handleOpenNotification('error', error)
  }
})
</script>

<template>
  <ModalLayout :is-opened="isOpened">
    <div
      v-if="isOpened"
      class="new-password-modal p-3 rounded"
    >
      <Typography class-name="fs-3 text-primary">Новый пароль</Typography>

      <Input
        v-for="input in newPasswordModalInputs"
        :key="input.id"
        :name="input.name"
        :type="input.type"
        :placeholder="input.placeholder"
      >
        <template #prepend>
          <i :class="input.prepend"></i>
        </template>
      </Input>

      <Button
        class-name="btn-primary w-100"
        @click="handleUpdatePassword"
      >
        Изменить пароль
      </Button>

      <NotificationModal
        :type="responseMessage.type"
        :is-opened="isOpenedNotification"
        @close-modal="handleCloseNotification"
        :time-expired="5000"
      >
        {{ responseMessage.message }}
      </NotificationModal>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.new-password-modal {
  width: 400px;
  background-color: $white-color;

  @include flexible(
    flex-end,
    flex-start,
    column,
    $gap: 16px,
    $align-self: center,
    $justify-self: center
  );

  @include flexible(center, flex-start, column, $gap: 16px);

  transition: all $default-transition-settings;
}

.modal-layout-enter-from .new-password-modal,
.modal-layout-leave-to .new-password-modal {
  transform: scale(0.9);
}
</style>
