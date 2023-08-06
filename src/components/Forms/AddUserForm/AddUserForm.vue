<script lang="ts" setup>
import { reactive, ref } from 'vue'

import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Typography from '@Components/Typography/Typography.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { InvitationForm } from '@Domain/Invitation'
import ResponseMessage from '@Domain/ResponseMessage'

import AuthService from '@Services/AuthService'

import getRoles from '@Utils/getRoles'

const currentRoles = getRoles()

const userData = reactive<InvitationForm>({
  email: '',
  file: null,
  roles: [],
})
const response = ref<ResponseMessage>()

const inviteUserByEmail = async () => {
  response.value = await AuthService.inviteUserByEmail(userData)
}
</script>

<template>
  <FormLayout class-name="add-user-form">
    <Typography class-name="fs-3 text-primary">
      Добавление пользователей
    </Typography>

    <div class="add-user-form__data w-100">
      <Input
        type="text"
        v-model="userData.email"
        placeholder="Введите email"
      />

      <Button
        class-name="btn-primary"
        icon-name="bi bi-plus-lg"
        data-bs-toggle="collapse"
        data-bs-target="#checkboxRoles"
        aria-expanded="false"
        aria-controls="collapseExample"
      >
        роли
      </Button>
    </div>
    <DropDown
      id="checkboxRoles"
      class-name="w-100"
    >
      <Checkbox
        v-for="role in currentRoles.roles"
        :key="role"
        :label="currentRoles.translatedRoles[role]"
        v-model="userData.roles"
        :value="role"
      />
    </DropDown>

    <Button
      class-name="btn-primary w-100"
      @click="inviteUserByEmail"
    >
      Добавить
    </Button>

    <Typography>{{ response?.success }}</Typography>
  </FormLayout>
</template>

<style lang="scss">
.add-user-form {
  width: 550px;

  &__data {
    @include flexible(center, space-between, $gap: 16px);
  }
}
</style>
