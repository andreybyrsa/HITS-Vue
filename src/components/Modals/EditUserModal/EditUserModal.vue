<script lang="ts" setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Typography from '@Components/Typography/Typography.vue'
import ModalLayout from '@Components/Modals/ModalLayout/ModalLayout.vue'
import {
  EditUserModalProps,
  EditUserModalEmits,
} from '@Components/Modals/EditUserModal/EditUserModal.types'
import Collapse from '@Components/Collapse/Collapse.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

import { UpdateUserData } from '@Domain/ManageUsers'
import RolesTypes from '@Domain/Roles'

import useUserStore from '@Store/user/userStore'

import ManageUsersService from '@Services/ManageUsersService'

import getRoles from '@Utils/getRoles'
import Validation from '@Utils/Validation'
import useNotification from '@Utils/useNotification'

const props = defineProps<EditUserModalProps>()

const emit = defineEmits<EditUserModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const {
  responseMessage,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

const availableRoles = getRoles()

const { errors, setValues, handleSubmit } = useForm<UpdateUserData>({
  validationSchema: {
    newEmail: (value: string) =>
      Validation.checkEmail(value) || 'Неверно введена почта',
    newFirstName: (value: string) =>
      Validation.checkName(value) || 'Неверно введено имя',
    newLastName: (value: string) =>
      Validation.checkName(value) || 'Неверно введена фамилия',
    newRoles: (value: RolesTypes[]) => value?.length,
  },
})

watch(
  () => props.user,
  () => {
    if (props.user) {
      const { email, firstName, lastName, roles } = props.user

      setValues({
        email,
        newEmail: email,
        newFirstName: firstName,
        newLastName: lastName,
        newRoles: roles,
      })
    }
  },
)

const handleEditUser = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { success, error } = await ManageUsersService.updateUserInfo(
      values,
      token,
    )

    if (success) {
      return emit('close-modal', values, success)
    } else {
      handleOpenNotification('error', error)
    }
  }
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div
      v-if="isOpened"
      class="edit-user-modal p-3 rounded-3"
    >
      <div class="edit-user-modal__header w-100">
        <Typography class-name="fs-3 text-primary">Редактировать</Typography>

        <Button
          class-name="btn-close"
          @click="emit('close-modal')"
        ></Button>
      </div>

      <template v-if="user">
        <div class="edit-user-modal__inputs w-100">
          <Input
            type="email"
            name="newEmail"
            placeholder="Введите email"
            prepend="@"
          />

          <Input
            name="newFirstName"
            placeholder="Введите имя"
          >
            <template #prepend>
              <i class="bi bi-fonts"></i>
            </template>
          </Input>

          <Input
            name="newLastName"
            placeholder="Введите фамилию"
          >
            <template #prepend>
              <i class="bi bi-fonts"></i>
            </template>
          </Input>

          <Button
            id="checkbox-roles"
            :class-name="
              errors.newRoles ? 'btn-outline-danger px-2 py-0' : 'px-2 py-0'
            "
            append-icon-name="bi bi-chevron-down"
            is-collapse-controller
          >
            Роли
          </Button>
          <Collapse
            id="checkbox-roles"
            class-name="w-100"
          >
            <template
              v-for="role in availableRoles.roles"
              :key="role"
            >
              <Checkbox
                name="newRoles"
                class-name="drop-down-item"
                :label="availableRoles.translatedRoles[role]"
                :value="role"
              />
            </template>
          </Collapse>
        </div>

        <Button
          type="submit"
          class-name="btn-primary w-100"
          @click="handleEditUser"
        >
          Сохранить изменения
        </Button>
      </template>

      <NotificationModal
        :type="responseMessage.type"
        :is-opened="isOpenedNotification"
        @close-modal="handleCloseNotification"
        :time-expired="5000"
      >
        {{ responseMessage.message }}
      </NotificationModal>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.edit-user-modal {
  width: 400px;
  background-color: $white-color;

  @include flexible(
    flex-end,
    flex-start,
    column,
    $gap: 16px,
    $align-self: center,
    $justify-self: center
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }

  &__inputs {
    @include flexible(center, flex-start, column, $gap: 8px);
  }
}

.modal-layout-enter-from .edit-user-modal,
.modal-layout-leave-to .edit-user-modal {
  transform: scale(0.9);
}
</style>
