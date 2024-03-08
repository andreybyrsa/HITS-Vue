<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import { RegisterUser, RolesTypes } from '@Domain'
import { useUserStore, useNotificationsStore } from '@Store'
import { InviteService } from '@Service'
import { validation } from '@Utils'
import { registerInputs } from '@Components/Forms/RegisterForm/RegisterFormInputs'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'

const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

const route = useRoute()

const isLoading = ref(false)

onMounted(async () => {
  const { slug } = route.params
  const response = await InviteService.getInvitationInfo(slug)

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
      validation.checkEmail(value) || 'Неверно введена почта',
    firstName: (value: string) =>
      validation.checkName(value) || 'Неверно введено имя',
    lastName: (value: string) =>
      validation.checkName(value) || 'Неверно введена фамилия',
    password: (value: string) => validation.checkPassword(value),
    roles: (value: RolesTypes[]) => validation.checkIsEmptyValue(value),
    telephone: (value: string) =>
      validation.checkIsEmptyValue(value) || 'Это обязательное поле',
  },
})

const handleRegister = handleSubmit(async (values) => {
  const slug = route.params.slug.toString()
  console.log(values)

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
@Utils/validation
