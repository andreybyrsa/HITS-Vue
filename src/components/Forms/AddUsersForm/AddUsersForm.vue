<script lang="ts" setup>
import { reactive, ref } from 'vue'

import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Typography from '@Components/Typography/Typography.vue'
import { HTMLInputEvent } from '@Components/Inputs/Input/Input.types'
import EmailsModal from '@Components/Modals/EmailsModal/EmailsModal.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { InvitationForm } from '@Domain/Invitation'
import ResponseMessage from '@Domain/ResponseMessage'

import ManageUsersService from '@Services/ManageUsersService'

import getRoles from '@Utils/getRoles'

const currentRoles = getRoles()

const isFileInput = ref(false)
const isEmailsModalOpened = ref(false)

const invitationData = reactive<InvitationForm>({
  email: '',
  emails: [],
  roles: [],
})

const response = ref<ResponseMessage>()

function handleOpenModal() {
  if (invitationData.emails.length) {
    isEmailsModalOpened.value = true
  }
}

function handleCloseModal() {
  isEmailsModalOpened.value = false
}

function handleFileChange(event: HTMLInputEvent) {
  const rawFile = event.target.files?.length && event.target.files[0]

  if (rawFile) {
    const fileURL = URL.createObjectURL(rawFile)

    fetch(fileURL)
      .then((response) => response.text())
      .then((text) => {
        const regExpPattern = /^\w+@[a-zA-Z_]+.[a-zA-Z]{2,10}/gm

        const formattedEmails = text.match(regExpPattern)
        if (formattedEmails) {
          invitationData.emails = formattedEmails
        }
      })

    isEmailsModalOpened.value = true
  }
}

function handleRemoveEmail(index: number) {
  invitationData.emails?.splice(index, 1)
}

const inviteUsers = async () => {
  if (isFileInput.value) {
    response.value = await ManageUsersService.inviteUsersByFile(invitationData)
  } else {
    response.value = await ManageUsersService.inviteUserByEmail(invitationData)
  }
}
</script>

<template>
  <FormLayout class-name="add-users-form">
    <Typography class-name="fs-3 text-primary">
      Добавление пользователей
    </Typography>

    <div class="add-users-form__data w-100">
      <Input
        v-if="isFileInput"
        type="file"
        @change="handleFileChange"
      />
      <Input
        v-else
        v-model="invitationData.email"
        placeholder="Введите email"
        prepend="@"
      />

      <Button
        id="checkboxRoles"
        icon-name="bi bi-plus-lg"
        class-name="btn-primary"
        is-drop-down-controller
      >
        Роли
      </Button>
      <Button
        v-if="isFileInput && invitationData.emails.length"
        icon-name="bi bi-file-earmark-check"
        class-name="btn-primary"
        @click="handleOpenModal"
      ></Button>

      <EmailsModal
        :is-opened="isEmailsModalOpened"
        @close-modal="handleCloseModal"
        :emails="invitationData.emails"
        @remove-email="handleRemoveEmail"
      />
    </div>

    <DropDown
      id="checkboxRoles"
      class-name="w-100"
    >
      <Checkbox
        v-for="role in currentRoles.roles"
        :key="role"
        :label="currentRoles.translatedRoles[role]"
        v-model="invitationData.roles"
        :value="role"
      />
    </DropDown>

    <Button
      class-name="btn-primary w-100"
      @click="inviteUsers"
    >
      Добавить
    </Button>

    <button
      class="fs-5"
      @click="isFileInput = !isFileInput"
    >
      <span v-if="isFileInput">Добавить по почте</span>
      <span v-else>Загрузить файл</span>
    </button>

    <Typography
      v-if="response?.success"
      class-name="text-success"
    >
      {{ response?.success }}
    </Typography>
  </FormLayout>
</template>

<style lang="scss">
.add-users-form {
  width: 600px;

  &__data {
    @include flexible(stretch, space-between, $gap: 16px);
  }
}
</style>
