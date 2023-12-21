<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import { NewPasswordModalProps } from '@Components/Modals/NewPasswordModal/NewPasswordModal.types'
import newPasswordModalInputs from '@Components/Modals/NewPasswordModal/NewPasswordModalInputs'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { UpdateUserPassword } from '@Domain/ManageUsers'

import ManageUsersService from '@Services/ManageUsersService'

import useNotificationsStore from '@Store/notifications/notificationsStore'

import Validation from '@Utils/Validation'
import { getChangeStatusCode, ChangeStatusCode } from '@Utils/changeStatusCodeInfo'

const props = defineProps<NewPasswordModalProps>()

const notificationsStore = useNotificationsStore()

const router = useRouter()

const changeStatusCodeInfo = getChangeStatusCode()

const isLoading = ref(false)

const { setValues, handleSubmit } = useForm<UpdateUserPassword>({
  validationSchema: {
    key: (value: string) => Validation.checkIsEmptyValue(value),
    email: (value: string) => Validation.checkEmail(value),
    code: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Неверно введен код',
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
  isLoading.value = true
  const response = await ManageUsersService.updateUserPassword(values)
  isLoading.value = false

  if (response instanceof Error) {
    const messageResponse = response.message as ChangeStatusCode
    const messageText = changeStatusCodeInfo.translatedStatus[messageResponse]

    if (messageResponse === 'CHANGE_FAILED') {
      router.push('/login')
    }
    return notificationsStore.createSystemNotification('Система', messageText)
  }

  notificationsStore.createSystemNotification('Система', 'Успешное изменение пароля')
  router.push('/login')
})
</script>

<template>
  <ModalLayout :is-opened="isOpened">
    <FormLayout
      v-if="isOpened"
      class-name="new-password-modal p-3 rounded"
    >
      <Typography class-name="fs-3 text-primary text-center">
        Новый пароль
      </Typography>

      <Input
        v-for="input in newPasswordModalInputs"
        :key="input.id"
        type="text"
        :name="input.name"
        class-name="rounded-end"
        :placeholder="input.placeholder"
      >
        <template #prepend>
          <i :class="input.prepend"></i>
        </template>
      </Input>

      <Button
        variant="primary"
        type="submit"
        :is-loading="isLoading"
        @click="handleUpdatePassword"
      >
        Изменить пароль
      </Button>
    </FormLayout>
  </ModalLayout>
</template>

<style lang="scss">
.new-password-modal {
  width: 400px;
  background-color: $white-color;

  @include flexible(
    stretch,
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
