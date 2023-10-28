<script lang="ts" setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import { NewPasswordModalProps } from '@Components/Modals/NewPasswordModal/NewPasswordModal.types'
import newPasswordModalInputs from '@Components/Modals/NewPasswordModal/NewPasswordModalInputs'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'

import { UpdateUserPassword } from '@Domain/ManageUsers'

import ManageUsersService from '@Services/ManageUsersService'

import Validation from '@Utils/Validation'

import useNotificationsStore from '@Store/notifications/notificationsStore'

const notificationsStore = useNotificationsStore()

const props = defineProps<NewPasswordModalProps>()

const router = useRouter()

const { setValues, handleSubmit } = useForm<UpdateUserPassword>({
  validationSchema: {
    key: (value: string) => value?.length,
    email: (value: string) => Validation.checkEmail(value),
    code: (value: string) => value?.length || 'Неверно введен код',
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
  const response = await ManageUsersService.updateUserPassword(values)

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  router.push('/login')
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
        :type="input.type"
        :name="input.name"
        class-name="rounded-end"
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
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.new-password-modal {
  width: 400px;
  background-color: $white-color;

  @include flexible(
    center,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  transition: all $default-transition-settings;
}

.modal-layout-enter-from .new-password-modal,
.modal-layout-leave-to .new-password-modal {
  transform: scale(0.9);
}
</style>
