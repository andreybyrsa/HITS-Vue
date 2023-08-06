<script lang="ts" setup>
import { reactive } from 'vue'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import loginInputs from '@Components/Forms/LoginForm/LoginFormInputs'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { LoginUser } from '@Domain/User'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()

const userData = reactive<LoginUser>({
  email: '',
  password: '',
})

function handleLogin(user: LoginUser) {
  userStore.loginUser(user)
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
      :placeholder="input.placeholder"
      :prepend="input.prepend"
    >
      <template #prepend>
        <i :class="input.prependIcon"></i>
      </template>
    </Input>

    <Button
      class-name="btn-primary w-100"
      @click="handleLogin(userData)"
    >
      Войти
    </Button>
  </FormLayout>
</template>
