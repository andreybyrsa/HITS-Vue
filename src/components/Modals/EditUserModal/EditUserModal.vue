<script lang="ts" setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Typography from '@Components/Typography/Typography.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import {
  EditUserModalProps,
  EditUserModalEmits,
} from '@Components/Modals/EditUserModal/EditUserModal.types'
import editUserInputs from '@Components/Modals/EditUserModal/EditUserInputs'
import Collapse from '@Components/Collapse/Collapse.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Icon from '@Components/Icon/Icon.vue'

import RolesTypes from '@Domain/Roles'
import { User } from '@Domain/User'

import ManageUsersService from '@Services/ManageUsersService'

import useUserStore from '@Store/user/userStore'

import getRoles from '@Utils/getRoles'
import Validation from '@Utils/Validation'

const users = defineModel<User[]>({
  required: true,
})
const props = defineProps<EditUserModalProps>()
const emit = defineEmits<EditUserModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const availableRoles = getRoles()

const { errors, setValues, handleSubmit } = useForm<User>({
  validationSchema: {
    email: (value: string) =>
      Validation.checkEmail(value) || 'Неверно введена почта',
    firstName: (value: string) =>
      Validation.checkName(value) || 'Неверно введено имя',
    lastName: (value: string) =>
      Validation.checkName(value) || 'Неверно введена фамилия',
    roles: (value: RolesTypes[]) => value?.length,
  },
})

watch(
  () => props.user,
  () => {
    if (props.user) {
      setValues({ ...props.user })
    }
  },
)

const handleEditUser = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await ManageUsersService.updateUserInfo(values, token)

    if (response instanceof Error) {
      return // notification
    }

    const currentUserIndex = users.value.findIndex((user) => user.id === response.id)
    if (currentUserIndex !== -1) {
      users.value.splice(currentUserIndex, 1, response)
    }

    // notification
    emit('close-modal')
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
            v-for="input in editUserInputs"
            :key="input.id"
            :type="input.type"
            :name="input.name"
            validate-on-update
            class-name="rounded-end"
            :placeholder="input.placeholder"
            :prepend="input.prepend"
          >
            <template #prepend>
              <Icon :class-name="input.prependIconName" />
            </template>
          </Input>

          <Button
            :class-name="errors.roles ? 'btn-outline-danger px-2 py-0' : 'px-2 py-0'"
            append-icon-name="bi bi-chevron-down"
            v-collapse="'editUserModalCollapse'"
          >
            Роли
          </Button>
          <Collapse
            id="editUserModalCollapse"
            class-name="w-100"
          >
            <template
              v-for="role in availableRoles.roles"
              :key="role"
            >
              <Checkbox
                name="roles"
                class-name="drop-down-item"
                validate-on-update
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
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }

  &__inputs {
    @include flexible(center, flex-start, column, $gap: 12px);
  }
}

.modal-layout-enter-from .edit-user-modal,
.modal-layout-leave-to .edit-user-modal {
  transform: scale(0.9);
}
</style>
