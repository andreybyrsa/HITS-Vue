<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import NewPasswordModal from '@Components/Modals/NewPasswordModal/NewPasswordModal.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import useUserStore from '@Store/user/userStore'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { NewEmailForm } from '@Domain/Invitation'

import InvitationService from '@Services/InvitationService'

import Validation from '@Utils/Validation'

const isOpenedModal = ref(false)
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const response = reactive({
  success: '',
  key: '',
  error: '',
})

const { values, handleSubmit } = useForm<NewEmailForm>({
  validationSchema: {
    email: (value: string) =>
      Validation.checkEmail(value) || 'Ошибка авторизации',
  },
})

function handleCloseModal() {
  isOpenedModal.value = false
}

// const sendChangingCode = handleSubmit(async (values) => {
//   const { key, error } = await InvitationService.changeEmailRequest(values)

//   if (key) {
//     response.key = key
//     isOpenedModal.value = true
//   } else {
//     response.error = error ?? 'Ошибка отправки кода'
//   }
// })

const sendChangingUrl = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const { success, error } = await InvitationService.sendUrlToChangeEmail(
      values,
      token,
    )
    if (success) {
      response.success = success
      isOpenedModal.value = true
    } else {
      response.error = error ?? 'Ошибка отправки ссылки'
      console.log(error)
    }
  }
})
</script>

<template>
  <PageLayout content-class-name="change-email-page__content">
    <template #leftSideBar>
      <LeftSideBar />
    </template>
    <template #content>
      <FormLayout class-name="text-center">
        <Typography class-name="fs-3 text-primary">
          Изменение почты
        </Typography>

        <Input
          type="email"
          name="email"
          placeholder="Введите ваш новый email"
          prepend="@"
        />

        <Button
          type="submit"
          class-name="btn-primary w-100"
          @click="sendChangingUrl"
        >
          Отправить
        </Button>

        <Typography
          v-if="response.error"
          class-name="text-danger fs-6"
        >
          {{ response.error }}
        </Typography>

        <NewPasswordModal
          :is-opened="isOpenedModal"
          :email="values.oldEmail"
          :auth-key="response.key"
          @close-modal="handleCloseModal"
        />
      </FormLayout>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.change-email-page {
  &__content {
    @include flexible(center, center);
  }
}
</style>
