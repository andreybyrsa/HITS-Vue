<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import loginInputs from '@Components/Forms/LoginForm/LoginFormInputs'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { LoginUser } from '@Domain/User'

import useNotification from '@Hooks/useNotification'

import useUserStore from '@Store/user/userStore'

import Validation from '@Utils/Validation'

const userStore = useUserStore()
const { loginError } = storeToRefs(userStore)

const { isOpenedNotification, handleOpenNotification, handleCloseNotification } =
  useNotification()

const { handleSubmit } = useForm<LoginUser>({
  validationSchema: {
    email: (value: string) =>
      Validation.checkEmail(value) || 'Неверно введена почта',
    password: (value: string) => Validation.checkPassword(value),
  },
})

const handleLogin = handleSubmit(async (values) => {
  await userStore.loginUser(values)

  if (loginError?.value) {
    handleOpenNotification()
  }
})
</script>

<template>
  <FormLayout>
    <Typography class-name="fs-3 text-primary">Авторизация</Typography>

    <Input
      v-for="input in loginInputs"
      :key="input.key"
      :type="input.type"
      :name="input.name"
      :placeholder="input.placeholder"
      :prepend="input.prepend"
    >
      <template #prepend>
        <i :class="input.prependIcon"></i>
      </template>
    </Input>

    <router-link to="/forgot-password">Забыли пароль?</router-link>

    <Button
      type="submit"
      class-name="btn-primary w-100"
      @click="handleLogin"
    >
      Войти
    </Button>

    <NotificationModal
      type="error"
      :is-opened="isOpenedNotification"
      @close-modal="handleCloseNotification"
      :time-expired="5000"
    >
      {{ loginError }}
    </NotificationModal>
  </FormLayout>
</template>
