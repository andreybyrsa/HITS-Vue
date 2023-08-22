<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import useUserStore from '@Store/user/userStore'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'
import useNotification from '@Utils/useNotification'
import { NewEmailForm } from '@Domain/Invitation'
import InvitationService from '@Services/InvitationService'
import Validation from '@Utils/Validation'

const isConfirmationModalOpen = ref(false)

function openConfirmationModal() {
  isConfirmationModalOpen.value = true
}

const {
  responseMessage,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const response = reactive({
  success: '',
  key: '',
  error: '',
})
const { values, handleSubmit } = useForm<NewEmailForm>({
  validationSchema: {
    newEmail: (value: string) =>
      Validation.checkEmail(value) || 'Ошибка авторизации',
    oldEmail: (value: string) =>
      Validation.checkEmail(value) || 'Ошибка авторизации',
  },
  initialValues: { oldEmail: user.value?.email },
})

const sendChangingUrl = handleSubmit(async (values) => {
  const currentUser = user.value
  console.log(values)
  if (currentUser?.token) {
    const { token } = currentUser
    const { success, error } = await InvitationService.sendUrlToChangeEmail(
      values,
      token,
    )
    if (success) {
      openConfirmationModal()
      handleOpenNotification('success', success)
    } else {
      handleOpenNotification('error', error)
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
      <router-view></router-view>
      <FormLayout class-name="text-center">
        <Typography class-name="fs-3 text-primary">
          Изменение почты
        </Typography>
        <Input
          type="email"
          name="newEmail"
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
          :type="responseMessage.type"
          :is-opened="isOpenedNotification"
          @close-modal="handleCloseNotification"
          :time-expired="5000"
        >
          {{ responseMessage.message }}
        </NotificationModal>
        <Typography
          v-if="response.error"
          class-name="text-danger fs-6"
        >
          {{ response.error }}
        </Typography>
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
