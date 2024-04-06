<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import registerInputs from '@Components/Forms/RegisterForm/RegisterFormInputs'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { RegisterUser } from '@Domain/User'
import RolesTypes from '@Domain/Roles'

import InvitationService from '@Services/InvitationService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import Validation from '@Utils/Validation'

const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

const route = useRoute()

const isLoading = ref(false)

onMounted(async () => {
  const { slug } = route.params
  const response = await InvitationService.getInvitationInfo(slug)

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  const { email, roles } = response
  setFieldValue('email', email)
  setFieldValue('roles', roles)
})

const { setFieldValue, handleSubmit } = useForm<RegisterUser>({
  validationSchema: {
    email: (value: string) =>
      Validation.checkEmail(value) || 'Неверно введена почта',
    firstName: (value: string) =>
      Validation.checkName(value) || 'Неверно введено имя',
    lastName: (value: string) =>
      Validation.checkName(value) || 'Неверно введена фамилия',
    password: (value: string) => Validation.checkPassword(value),
    roles: (value: RolesTypes[]) => Validation.checkIsEmptyValue(value),
    telephone: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
  },
})

const handleRegister = handleSubmit(async (values) => {
  const slug = route.params.slug.toString()

  isLoading.value = true
  await userStore.registerUser(values, slug)
  isLoading.value = false
})
</script>

<template>
  <FormLayout>
    <Typography class-name="fs-3 text-primary text-center">Регистрация</Typography>

    <div
      v-for="input in registerInputs"
      :key="input.key"
    >
      <Input
        v-if="input.name !== 'telephone'"
        :type="input.type"
        :name="input.name"
        class-name="rounded-end"
        :placeholder="input.placeholder"
        :prepend="input.prepend"
        :disabled="input.disabled"
      >
        <template #prepend>
          <i :class="input.prependIcon" />
        </template>
      </Input>

      <Input
        v-else
        :type="input.type"
        :name="input.name"
        class-name="rounded-end"
        :placeholder="input.placeholder"
        :prepend="input.prepend"
        :disabled="input.disabled"
        v-mask="'+7(###)-###-##-##'"
      >
        <template #prepend>
          <i :class="input.prependIcon" />
        </template>
      </Input>
    </div>

    <Button
      type="submit"
      variant="primary"
      :is-loading="isLoading"
      @click="handleRegister"
    >
      Зарегистрироваться
    </Button>
  </FormLayout>
</template>
