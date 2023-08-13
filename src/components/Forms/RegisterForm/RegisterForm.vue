<script lang="ts" setup>
import { reactive, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import registerInputs from '@Components/Forms/RegisterForm/RegisterFormInputs'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { RegisterUser } from '@Domain/User'
import RolesTypes from '@Domain/Roles'
import ResponseMessage from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import InvitationService from '@Services/InvitationService'

import Validation from '@Utils/Validation'

const userStore = useUserStore()
const { registerError } = storeToRefs(userStore)

const route = useRoute()

const response = reactive<ResponseMessage>({
  error: '',
})

watch(
  () => registerError?.value,
  () => {
    response.error = registerError?.value
  },
)

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
  await InvitationService.deleteInvitationInfo(slug)
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
    response.error = error ?? 'Ошибка приглашения'
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

    <Typography
      v-if="response.error"
      class-name="text-danger text-center fs-6"
    >
      {{ response.error }}
    </Typography>
  </FormLayout>
</template>
