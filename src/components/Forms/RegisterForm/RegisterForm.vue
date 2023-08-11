<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import registerInputs from '@Components/Forms/RegisterForm/RegisterFormInputs'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { RegisterUser } from '@Domain/User'

import useUserStore from '@Store/user/userStore'

import ManageUsersService from '@Services/ManageUsersService'

import Validation from '@Utils/Validation'
import RolesTypes from '@Domain/Roles'

const userStore = useUserStore()
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

const handleRegister = handleSubmit((values) => {
  userStore.registerUser(values)
})

onMounted(async () => {
  const { email, roles } = await ManageUsersService.getInvitationInfo(
    route.params.slug,
  )
  if (email && roles) {
    setFieldValue('email', email)
    setFieldValue('roles', roles)
  }
})
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
  </FormLayout>
</template>
