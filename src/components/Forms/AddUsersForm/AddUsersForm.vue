<script lang="ts" setup>
import { ref, VueElement } from 'vue'
import { useFieldArray, useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Typography from '@Components/Typography/Typography.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'
import FormControllers from '@Components/Forms/AddUsersForm/FormControllers.vue'
import FormInputs from '@Components/Forms/AddUsersForm/FormInputs.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { InviteUsersForm } from '@Domain/Invitation'
import RolesTypes from '@Domain/Roles'

import useNotification from '@Hooks/useNotification'

import useUserStore from '@Store/user/userStore'

import InvitationService from '@Services/InvitationService'

import Validation from '@Utils/Validation'
import getRoles from '@Utils/getRoles'

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const currentRoles = getRoles()
const fileInputRef = ref<VueElement | null>(null)

const {
  notificationOptions,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

const { errors, resetForm, submitCount, handleSubmit } = useForm<InviteUsersForm>({
  validationSchema: {
    emails: (value: string[]) =>
      value?.every((email) => Validation.checkEmail(email)),
    roles: (value: RolesTypes[]) => value?.length,
  },
  initialValues: {
    emails: [''],
    roles: [],
  },
})

const { fields, push, move, remove } = useFieldArray<string>('emails')

const handleInvite = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await InvitationService.inviteUsers(values, token)

    if (response instanceof Error) {
      return handleOpenNotification('error', 'Ошибка приглашения групп')
    }

    handleOpenNotification('success', 'Успешное приглашение пользователей')
    resetForm()
  }
})
</script>

<template>
  <FormLayout class-name="add-users-form">
    <Typography class-name="fs-3 text-primary">
      Добавление пользователей
    </Typography>

    <div class="add-users-form__content w-100">
      <FormInputs
        :fileds="fields"
        :submit-count="submitCount"
        v-model="fileInputRef"
        @push-email="push"
        @move-email="move"
        @remove-email="remove"
      />

      <FormControllers
        :file-input-ref="fileInputRef"
        :roles-error="errors.roles"
        @push-email="push"
      />
    </div>

    <Collapse
      id="addUsersFromCollapse"
      class-name="w-100"
    >
      <Checkbox
        v-for="role in currentRoles.roles"
        :key="role"
        name="roles"
        :value="role"
        :label="currentRoles.translatedRoles[role]"
      />
    </Collapse>

    <Button
      type="submit"
      class-name="btn-primary w-100"
      @click="handleInvite"
    >
      Добавить
    </Button>

    <NotificationModal
      :type="notificationOptions.type"
      :is-opened="isOpenedNotification"
      @close-modal="handleCloseNotification"
      :time-expired="5000"
    >
      {{ notificationOptions.message }}
    </NotificationModal>
  </FormLayout>
</template>

<style lang="scss" scoped>
.add-users-form {
  width: fit-content;

  &__content {
    @include flexible(stretch, space-between, column, $gap: 12px);
  }

  &__inputs {
    max-height: 250px;

    overflow-y: scroll;

    @include flexible(stretch, flex-start, column, $gap: 8px);
  }

  &__input {
    @include flexible(flex-start, flex-start, $gap: 8px);
  }
}
</style>
