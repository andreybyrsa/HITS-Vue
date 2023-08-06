<script lang="ts" setup>
import { reactive } from 'vue'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import registerInputs from '@Components/Forms/RegisterForm/RegisterFormInputs'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { RegisterUser } from '@Domain/User'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()

const userData = reactive<RegisterUser>({
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
  <FormLayout>
    <Typography class-name="fs-3 text-primary"> Регистрация </Typography>

    <Input
      v-for="input in registerInputs"
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
      @click="handleRegister(userData)"
    >
      Зарегистрироваться
    </Button>
  </FormLayout>
</template>
