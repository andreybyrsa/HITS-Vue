<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import registerInputs from '@Components/Forms/RegisterForm/RegisterFormInputs'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { RegisterUser } from '@Domain/User'
import RolesTypes from '@Domain/Roles'

import useUserStore from '@Store/user/userStore'

import InvitationService from '@Services/InvitationService'

import Validation from '@Utils/Validation'

const userStore = useUserStore()
const { registerError } = storeToRefs(userStore)

const isOpenedNotification = ref(false)
const route = useRoute()

const { setFieldValue, handleSubmit } = useForm<RegisterUser>({
  validationSchema: {
    email: (value: string) =>
      Validation.checkEmail(value) || 'Неверно введена почта',
    firstName: (value: string) =>
      Validation.checkName(value) || 'Неверно введено имя',
    lastName: (value: string) =>
      Validation.checkName(value) || 'Неверно введена фамилия',
    password: (value: string) => Validation.checkPassword(value),
    roles: (value: RolesTypes[]) => value?.length,
  },
})

const handleRegister = handleSubmit(async (values) => {
  const { slug } = route.params

  await userStore.registerUser(values)

  if (registerError?.value) {
    isOpenedNotification.value = true
  } else {
    await InvitationService.deleteInvitationInfo(slug)
  }
})

onMounted(async () => {
  const { slug } = route.params
  const { email, roles, error } = await InvitationService.getInvitationInfo(
    slug,
  )

  if (email && roles) {
    setFieldValue('email', email)
    setFieldValue('roles', roles)
  } else {
    userStore.registerError = error ?? 'Ошибка приглашения'
    isOpenedNotification.value = true
  }
})

function handleNotificationClose() {
  isOpenedNotification.value = false
}
</script>

<template>
  <FormLayout>
    <Typography class-name="fs-3 text-primary">Регистрация</Typography>

    <Input
      v-for="input in registerInputs"
      :key="input.key"
      :type="input.type"
      :name="input.name"
      :placeholder="input.placeholder"
      :prepend="input.prepend"
      :disabled="input.disabled"
    >
      <template #prepend>
        <i :class="input.prependIcon"></i>
      </template>
    </Input>

    <Button
      type="submit"
      class-name="btn-primary w-100"
      @click="handleRegister"
    >
      Зарегистрироваться
    </Button>

    <NotificationModal
      type="error"
      :is-opened="isOpenedNotification"
      @close-modal="handleNotificationClose"
      :time-expired="5000"
    >
      {{ registerError }}
    </NotificationModal>
  </FormLayout>
</template>
