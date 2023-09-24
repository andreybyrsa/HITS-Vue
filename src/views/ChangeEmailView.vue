<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Typography from '@Components/Typography/Typography.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { NewEmailForm } from '@Domain/Invitation'

import useNotification from '@Hooks/useNotification'

import useUserStore from '@Store/user/userStore'

import InvitationService from '@Services/InvitationService'

import Validation from '@Utils/Validation'

const {
  notificationOptions,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

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
      return handleOpenNotification('error', 'Ошибка изменения почты')
    }

    return handleOpenNotification(
      'success',
      'Ссылка на изменение почты находится в новой почте',
    )
  }
})
</script>

<template>
  <PageLayout content-class-name="change-email-page__content">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <router-view></router-view>

      <FormLayout>
        <Typography class-name="fs-3 text-primary">Изменение почты</Typography>
        <Input
          type="email"
          name="newEmail"
          class-name="rounded-end"
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

        <NotificationModal
          :type="notificationOptions.type"
          :is-opened="isOpenedNotification"
          @close-modal="handleCloseNotification"
        >
          {{ notificationOptions.message }}
        </NotificationModal>
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
