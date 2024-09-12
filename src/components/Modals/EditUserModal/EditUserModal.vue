<script lang="ts" setup>
import { ref, watch } from 'vue'
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
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { getUserRolesInfo } from '@Utils/userRolesInfo'
import Validation from '@Utils/Validation'

const notificationsStore = useNotificationsStore()

const users = defineModel<User[]>({
  required: true,
})
const props = defineProps<EditUserModalProps>()
const emit = defineEmits<EditUserModalEmits>()
const isLoading = ref(false)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const availableRoles = getUserRolesInfo()

const { errors, setValues, handleSubmit } = useForm<User>({
  validationSchema: {
    email: (value: string) =>
      Validation.checkEmail(value) || 'Неверно введена почта',
    firstName: (value: string) =>
      Validation.checkName(value) || 'Неверно введено имя',
    lastName: (value: string) =>
      Validation.checkName(value) || 'Неверно введена фамилия',
    telephone: (value: string) =>
      Validation.checkPhoneNumber(value) || 'Неверный формат номера телефона',
    studyGroup: (value: string) =>
      Validation.checkStudyGroup(value) || 'Неверный формат учебной группы',
    roles: (value: RolesTypes[]) => Validation.checkIsEmptyValue(value),
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

    isLoading.value = true
    const response = await ManageUsersService.updateUserInfo(values, token)
    isLoading.value = false

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const currentUserIndex = users.value.findIndex((user) => user.id === response.id)
    if (currentUserIndex !== -1) {
      users.value.splice(currentUserIndex, 1, response)
    }

    emit('close-modal')
    return notificationsStore.createSystemNotification(
      'Система',
      'Пользователь успешно изменен',
    )
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
          variant="close"
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

          <Input
            type="text"
            name="telephone"
            placeholder="Введите номер телефона"
            validate-on-update
            class-name="rounded-end"
            :prepend="'Телефон'"
          >
            <template #prepend>
              <i class="bi bi-telephone-fill"></i>
            </template>
          </Input>

          <Input
            type="text"
            name="studyGroup"
            placeholder="Введите учебную группу"
            validate-on-update
            class-name="rounded-end"
            :prepend="'Учебная группа'"
          >
            <template #prepend>
              <i class="bi bi-person-lines-fill"></i>
            </template>
          </Input>

          <Button
            class-name="px-2 py-0"
            :variant="errors.roles ? 'outline-danger' : 'mute'"
            append-icon-name="bi bi-chevron-down"
            v-collapse="'editUserModalCollapse'"
          >
            Роли
          </Button>
          <Collapse
            id="editUserModalCollapse"
            class-name="w-100"
          >
            <div
              class="d-flex"
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
            </div>
          </Collapse>
        </div>

        <Button
          type="submit"
          variant="primary"
          :is-loading="isLoading"
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
    stretch,
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
