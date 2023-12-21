<script lang="ts" setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Typography from '@Components/Typography/Typography.vue'
import {
  NewEmailRequestProps,
  NewEmailRequestEmits,
} from '@Components/Modals/NewEmailRequestModal/NewEmailRequest.types'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { NewEmailForm } from '@Domain/Invitation'

import InvitationService from '@Services/InvitationService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import Validation from '@Utils/Validation'

defineProps<NewEmailRequestProps>()
const emit = defineEmits<NewEmailRequestEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const isLoading = ref(false)

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

    isLoading.value = true
    const response = await InvitationService.sendUrlToChangeEmail(values, token)
    isLoading.value = false

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    notificationsStore.createSystemNotification(
      'Система',
      'Ссылка для изменения почты отправлена на новую почту',
    )
    emit('close-modal')
  }
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <FormLayout
      v-if="isOpened"
      class="new-email-request-modal bg-white p-3 rounded"
    >
      <div class="d-flex align-items-center justify-content-between">
        <Typography class-name="fs-3 text-primary text-center">
          Изменение почты
        </Typography>

        <Button
          variant="close"
          @click="emit('close-modal')"
        ></Button>
      </div>

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
        :is-loading="isLoading"
        @click="sendChangingUrl"
      >
        Отправить
      </Button>
    </FormLayout>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.new-email-request-modal {
  width: 400px;
  @include flexible(
    stretch,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  transition: all $default-transition-settings;
}

.modal-layout-enter-from .new-email-request-modal,
.modal-layout-leave-to .new-email-request-modal {
  transform: scale(0.9);
}
</style>
