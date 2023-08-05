<script lang="ts" setup>
import { reactive } from 'vue'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import registerInputs from '@Components/Forms/RegisterForm/RegisterFormInputs'

import { RegisterUser } from '@Domain/User'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()

const userData: RegisterUser = reactive({
  email: '',
  firstName: '',
  lastName: '',
  password: '',
})

function handleRegister(user: RegisterUser) {
  userStore.registerUser(user)
}
</script>

<template>
  <div class="register-form p-3 rounded-3 shadow">
    <Typography class-name="fs-3 text-primary"> Регистрация </Typography>

    <Input
      v-for="input in registerInputs"
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
      @click="handleRegister(userData)"
    >
      Зарегистрироваться
    </Button>
  </div>
</template>

<style lang="scss">
.register-form {
  width: 400px;

  @include flexible(center, flex-start, column, $gap: 16px);
}
</style>
