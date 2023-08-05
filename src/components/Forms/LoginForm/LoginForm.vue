<script lang="ts" setup>
import { reactive } from 'vue'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import loginInputs from '@Components/Forms/LoginForm/LoginFormInputs'

import { LoginUser } from '@Domain/User'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()

const userData: LoginUser = reactive({
  email: '',
  password: '',
})

function handleLogin(user: LoginUser) {
  userStore.loginUser(user)
}
</script>

<template>
  <div class="login-form p-3 rounded-3 shadow">
    <Typography class-name="fs-3 text-primary"> Авторизация </Typography>

    <Input
      v-for="input in loginInputs"
      :key="input.key"
      :type="input.type"
      v-model:value="userData[input.key]"
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
  </div>
</template>

<style lang="scss">
.login-form {
  width: 400px;

  @include flexible(center, flex-start, column, $gap: 16px);
}
</style>
