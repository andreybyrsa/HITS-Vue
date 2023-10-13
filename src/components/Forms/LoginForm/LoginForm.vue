<script lang="ts" setup>
import { useForm } from 'vee-validate'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import loginInputs from '@Components/Forms/LoginForm/LoginFormInputs'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { LoginUser } from '@Domain/User'

import useUserStore from '@Store/user/userStore'

import Validation from '@Utils/Validation'

const userStore = useUserStore()

const { handleSubmit } = useForm<LoginUser>({
  validationSchema: {
    email: (value: string) =>
      Validation.checkEmail(value) || 'Неверно введена почта',
    password: (value: string) => Validation.checkPassword(value),
  },
})

const handleLogin = handleSubmit(async (values) => {
  await userStore.loginUser(values)
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
      class-name="rounded-end"
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
  </FormLayout>
</template>
