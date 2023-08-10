<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import registerInputs from '@Components/Forms/RegisterForm/RegisterFormInputs'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { RegisterUser } from '@Domain/User'

import useUserStore from '@Store/user/userStore'

import ManageUsersService from '@Services/ManageUsersService'

const userStore = useUserStore()
const route = useRoute()

const userData = reactive<RegisterUser>({
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  roles: [],
})

function handleRegister(user: RegisterUser) {
  userStore.registerUser(user)
}

onMounted(async () => {
  const { email, roles } = await ManageUsersService.getInvitationInfo(
    route.params.slug,
  )
  userData.email = email
  userData.roles = roles
})
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
