<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import { ChangeEmailProps, ChangeEmailEmits } from '@Views/ChangeEmailView.types'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Typography from '@Components/Typography/Typography.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { NewEmailForm } from '@Domain/Invitation'

import InvitationService from '@Services/InvitationService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import Validation from '@Utils/Validation'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

defineProps<ChangeEmailProps>()
const emit = defineEmits<ChangeEmailEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const { handleSubmit } = useForm<NewEmailForm>({
  validationSchema: {
    newEmail: (value: string) =>
      Validation.checkEmail(value) || 'Неверно введена почта',
    oldEmail: (value: string) =>
      Validation.checkEmail(value) || 'Неверно введена почта',
  },
  initialValues: { oldEmail: user.value?.email },
})

const sendChangingUrl = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await InvitationService.sendUrlToChangeEmail(values, token)

    if (response instanceof Error) {
      return useNotificationsStore().createSystemNotification(
        'Система',
        response.message,
      )
    }

    useNotificationsStore().createSystemNotification(
      'Система',
      'Ссылка для изменения почты отправлена на новую почту',
    )
  }
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
    class-name="change-email-page"
  >
    <div class="change-email-page__content">
      <FormLayout>
        <Typography class-name="fs-3 text-primary text-center">
          Изменение почты
        </Typography>
        <Input
          type="email"
          name="newEmail"
          class-name="rounded-end"
          placeholder="Введите ваш новый email"
          prepend="@"
        />
        <Button
          type="submit"
          variant="primary"
          @click="sendChangingUrl"
        >
          Отправить
        </Button>
      </FormLayout>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.change-email-page {
  &__content {
    @include flexible(center, center);
  }
}
</style>
