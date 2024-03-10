<script lang="ts" setup>
import { ref, VueElement } from 'vue'
import { useFieldArray, useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Typography from '@Components/Typography/Typography.vue'
import FormControllers from '@Components/Forms/AddUsersForm/FormControllers.vue'
import FormInputs from '@Components/Forms/AddUsersForm/FormInputs.vue'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'
import { InviteUsersForm, RolesTypes } from '@Domain'
import { useUserStore, useNotificationsStore } from '@Store'
import { InviteService } from '@Service'
import { validation, getUserRolesInfo } from '@Utils'

const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

const { user } = storeToRefs(userStore)

const currentRoles = getUserRolesInfo()
const fileInputRef = ref<VueElement | null>(null)
const isLoading = ref(false)

const { errors, resetForm, submitCount, handleSubmit } = useForm<InviteUsersForm>({
  validationSchema: {
    emails: (value: string[]) =>
      value?.every((email) => validation.checkEmail(email)),
    roles: (value: RolesTypes[]) => validation.checkIsEmptyValue(value),
  },
  initialValues: {
    emails: [''],
    roles: [],
  },
})

const { fields, push, move, remove } = useFieldArray<string>('emails')

const handleInvite = handleSubmit(async (values) => {
  isLoading.value = true
  const response = await InviteService.inviteUsers(values)
  isLoading.value = false

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  resetForm()
  notificationsStore.createSystemNotification(
    'Система',
    'Приглашения успешно отправлены.',
  )
})
</script>

<template>
  <FormLayout class-name="add-users-form">
    <Typography class-name="fs-3 text-primary text-center">
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
      <div
        v-for="role in currentRoles.roles"
        :key="role"
        class="d-flex"
      >
        <Checkbox
          name="roles"
          :value="role"
          :label="currentRoles.translatedRoles[role]"
        />
      </div>
    </Collapse>

    <Button
      type="submit"
      variant="primary"
      :is-loading="isLoading"
      @click="handleInvite"
    >
      Добавить
    </Button>
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
@Utils/validation
