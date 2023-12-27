<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Header from '@Components/Header/Header.vue'
import LoadingWrapper from '@Components/LoadingWrapper/LoadingWrapper.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import { NewEmailForm } from '@Domain/Invitation'

import ManageUsersService from '@Services/ManageUsersService'
import InvitationService from '@Services/InvitationService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import Validation from '@Utils/Validation'
import { ChangeStatusCode, getChangeStatusCode } from '@Utils/changeStatusCodeInfo'
import { getRouteByUserRole } from '@Utils/userRolesInfo'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const router = useRouter()
const route = useRoute()
const { slug } = route.params

const changeStatusCodeInfo = getChangeStatusCode()

const isOpenedCodeModal = ref(false)
const isChangingEmail = ref(false)
const isFethingDataToChangeEmail = ref(false)

const { setFieldValue, handleSubmit } = useForm<NewEmailForm>({
  validationSchema: {
    oldEmail: (value: string) => Validation.checkEmail(value),
    code: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Неверно введен код',
    newEmail: (value: string) => Validation.checkEmail(value),
    key: (value: string) => Validation.checkIsEmptyValue(value),
  },
  initialValues: { key: slug.toString() },
})

onMounted(async () => {
  const { slug } = route.params
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    isFethingDataToChangeEmail.value = true
    const response = await InvitationService.getInfoToChangeEmail(slug, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    isFethingDataToChangeEmail.value = false

    const { newEmail, oldEmail } = response
    isOpenedCodeModal.value = true

    setFieldValue('newEmail', newEmail)
    setFieldValue('oldEmail', oldEmail)

    notificationsStore.createSystemNotification(
      'Система',
      'На старую почту отправлен код аутентификации',
    )
  }
})

const handleChangeEmail = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token, role } = currentUser

    isChangingEmail.value = true
    const response = await ManageUsersService.updateUserEmail(values, token)
    isChangingEmail.value = false

    if (response instanceof Error) {
      const messageResponse = response.message as ChangeStatusCode
      const messageText = changeStatusCodeInfo.translatedStatus[messageResponse]

      if (messageResponse === 'CHANGE_FAILED' && role) {
        router.push(getRouteByUserRole(role))
      }
      return notificationsStore.createSystemNotification('Система', messageText)
    }

    notificationsStore.createSystemNotification(
      'Система',
      'Успешное изменение почты',
    )
    userStore.logoutUser()
  }
})
</script>

<template>
  <PageLayout
    content-class-name="d-flex align-items-center justify-content-center bg-white p-3"
  >
    <template #header>
      <Header></Header>
    </template>

    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <FormLayout class-name="change-email-view__form position-relative p-3 rounded">
        <Typography class-name="fs-3 text-primary text-center">
          Новая почта
        </Typography>

        <Input
          type="text"
          name="code"
          class-name="rounded-end"
          placeholder="Введите код аутентификации"
        >
          <template #prepend>
            <i class="bi bi-shield-check"></i>
          </template>
        </Input>

        <Button
          variant="primary"
          type="submit"
          :is-loading="isChangingEmail"
          @click="handleChangeEmail"
        >
          Подтвердить
        </Button>

        <LoadingWrapper :is-loading="isFethingDataToChangeEmail" />
      </FormLayout>

      <router-view />
    </template>
  </PageLayout>
</template>

<style lang="scss">
.change-email-view {
  &__form {
    width: 400px;
  }
}
</style>
