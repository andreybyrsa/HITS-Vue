<script lang="ts" setup>
import { reactive } from 'vue'
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

const userData = reactive<LoginUser>({
  email: '',
  password: '',
})
const dataError = reactive({
  email: '',
  password: '',
})

const { validate } = useForm({
  validationSchema: {
    email: () => Validation.checkEmail(userData.email),
    password: () => Validation.checkPassword(userData.password),
  },
})

const handleLogin = async () => {
  const { errors, valid } = await validate()

  dataError.email = errors.email ? errors.email : ''
  dataError.password = errors.password ? errors.password : ''

  if (valid) {
    userStore.loginUser(userData)
  }
}
</script>

<template>
  <FormLayout>
    <Typography class-name="fs-3 text-primary"> Авторизация </Typography>

    <Input
      v-for="input in loginInputs"
      :key="input.key"
      :type="input.type"
      v-model="userData[input.key]"
      :error="dataError[input.key]"
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
