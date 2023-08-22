<script lang="ts" setup>
console.log(1)
import { ref, reactive, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import NewPasswordModal from '@Components/Modals/NewPasswordModal/NewPasswordModal.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'
import useUserStore from '@Store/user/userStore'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'
import { NewEmailForm, RecoveryData } from '@Domain/Invitation'
import { useRoute } from 'vue-router'

import InvitationService from '@Services/InvitationService'

import Validation from '@Utils/Validation'
import useNotification from '@Utils/useNotification'
import ManageUsersService from '@Services/ManageUsersService'

const isOpenedModal = ref(false)
const route = useRoute()
const authKey = ref('')
const expiredTime = ref('')
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const response = reactive({
  success: '',
  key: '',
  error: '',
})
const {
  responseMessage,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

const { setFieldValue, values, handleSubmit } = useForm<NewEmailForm>({
  validationSchema: {
    newEmail: (value: string) =>
      Validation.checkEmail(value) || 'Ошибка авторизации',
    oldEmail: (value: string) =>
      Validation.checkEmail(value) || 'Ошибка авторизации',
  },
  initialValues: { oldEmail: user.value?.email },
})

function startTimer() {
  let initialSeconds = 300

  const intervalID = setInterval(() => {
    const minutes = Math.floor(initialSeconds / 60)
    const seconds = initialSeconds - minutes * 60

    const currentMinutes =
      minutes.toString().length > 1 ? minutes : `0${minutes}`
    const currentSeconds =
      seconds.toString().length > 1 ? seconds : `0${seconds}`

    expiredTime.value = `${currentMinutes}:${currentSeconds}`

    if (initialSeconds > 0) {
      initialSeconds--
    } else {
      clearInterval(intervalID)
    }
  }, 1000)
}

const handleConfirmation = handleSubmit(async (values) => {
  const currentUser = user.value
  console.log(values)
  if (currentUser?.token) {
    const { token } = currentUser
    const { success, error } = await ManageUsersService.updateUserEmail(values)
    if (success) {
      handleOpenNotification('success', success)
    } else {
      handleOpenNotification('error', error)
    }
  }
})

onMounted(async () => {
  const { slug } = route.params
  const currentUser = user.value
  console.log(slug)
  if (currentUser?.token) {
    const { token } = currentUser
    const { success, error } = await InvitationService.sendNewCode(slug, token)
    console.log(token)
    if (success) {
      handleOpenNotification('success', success)
    } else {
      handleOpenNotification('error', error)
    }
  }
})

function handleNotificationClose() {
  isOpenedNotification.value = false
}
</script>

<template>
  <FormLayout class-name="text-center">
    <Typography class-name="fs-3 text-primary">
      Востановление пароля
    </Typography>

    <Input
      type="email"
      name="email"
      placeholder="Введите код"
      prepend="@"
    />

    <Button
      type="submit"
      class-name="btn-primary w-100"
      @click="handleConfirmation"
    >
      Отправить
    </Button>

    <NotificationModal
      :type="responseMessage.type"
      :is-opened="isOpenedNotification"
      @close-modal="handleCloseNotification"
    >
      {{
        responseMessage.type === 'success'
          ? `Код отправлен на почту ${values.oldEmail}. Время действия кода ${expiredTime}`
          : responseMessage.message
      }}
    </NotificationModal>

    <NewPasswordModal
      :is-opened="isOpenedModal"
      :email="values.oldEmail"
      :auth-key="authKey"
    />
  </FormLayout>
</template>

<style lang="scss">
.forgot-password-page {
  &__content {
    @include flexible(center, center);
  }
}
</style>
