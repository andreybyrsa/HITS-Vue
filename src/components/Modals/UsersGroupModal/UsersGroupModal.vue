<script lang="ts" setup>
import { ref, onMounted, onUpdated } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm, useFieldArray } from 'vee-validate'

import {
  UsersGroupModalProps,
  UsersGroupModalEmits,
} from '@Components/Modals/UsersGroupModal/UsersGroupModal.types'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import UsersColumns from '@Components/UserColumns/UsersColumns.vue'
import UsersGroupModalPlaceholder from '@Components/Modals/UsersGroupModal/UsersGroupModalPlaceholder.vue'

import { User } from '@Domain/User'
import UsersGroup from '@Domain/UsersGroup'
import RolesTypes from '@Domain/Roles'

import UsersGroupsService from '@Services/UsersGroupsService'
import ManageUsersService from '@Services/ManageUsersService'

import useUserStore from '@Store/user/userStore'

import getRoles from '@Utils/getRoles'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import Validation from '@Utils/Validation'

const notificationsStore = useNotificationsStore()

const props = defineProps<UsersGroupModalProps>()
const emit = defineEmits<UsersGroupModalEmits>()

const usersGroups = defineModel<UsersGroup[]>({
  required: true,
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const users = ref<User[]>([])
const unselectedUsers = ref<User[]>([])

const isLoadingGroup = ref(true)
const isCreating = ref(false)
const isUpdating = ref(false)

const groupRoles = getRoles().roles

const usersGroupModalMode = ref<'CREATE' | 'UPDATE'>('CREATE')

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const responseUsers = await ManageUsersService.getUsers(token)

    if (responseUsers instanceof Error) {
      return notificationsStore.createSystemNotification(
        'Система',
        responseUsers.message,
      )
    }

    users.value = responseUsers
  }
})

const { setValues, handleSubmit } = useForm<UsersGroup>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    users: (value: User[]) =>
      Validation.checkIsEmptyValue(value) || 'Выберите пользователей',
    roles: (value: RolesTypes[]) =>
      Validation.checkIsEmptyValue(value) || 'Выберите тип группы',
  },
  initialValues: { roles: [] },
})

const { fields, push, remove } = useFieldArray<User>('users')

onUpdated(async () => {
  if (props.usersGroupId !== undefined && props.isOpened) {
    const currentUser = user.value

    if (currentUser?.token) {
      const { token } = currentUser
      const { usersGroupId } = props

      isLoadingGroup.value = true
      const response = await UsersGroupsService.getUsersGroup(usersGroupId, token)

      if (response instanceof Error) {
        return notificationsStore.createSystemNotification(
          'Система',
          response.message,
        )
      }

      setValues({ ...response })
      unselectedUsers.value = users.value.filter((user) =>
        response.users.every((groupUser) => groupUser.id !== user.id),
      )
      usersGroupModalMode.value = 'UPDATE'

      isLoadingGroup.value = false
    }
  } else if (props.isOpened) {
    setValues({ name: '', users: [], roles: [] })
    unselectedUsers.value = [...users.value]
    usersGroupModalMode.value = 'CREATE'

    isLoadingGroup.value = false
  }
})

function selectUser(user: User, index: number) {
  push(user)
  unselectedUsers.value.splice(index, 1)
}

function unselectUser(user: User, index: number) {
  remove(index)
  unselectedUsers.value.push(user)
}

const handleCreateGroup = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    isCreating.value = true
    const response = await UsersGroupsService.createUsersGroup(values, token)
    isCreating.value = false

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    usersGroups.value.push(response)

    notificationsStore.createSystemNotification('Система', 'Группа успешно создана')
    emit('close-modal')
  }
})

const handleUpdateGroup = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = values

    isUpdating.value = true
    const response = await UsersGroupsService.updateUsersGroup(values, token, id)
    isUpdating.value = false

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const editingGroupIndex = usersGroups.value.findIndex(
      (group) => group.id === values.id,
    )

    if (editingGroupIndex !== -1) {
      usersGroups.value.splice(editingGroupIndex, 1, values)
    }

    notificationsStore.createSystemNotification('Система', 'Группа успешно изменена')

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
      class="users-group-modal p-3 bg-white rounded-3"
    >
      <template v-if="isLoadingGroup">
        <UsersGroupModalPlaceholder />
      </template>

      <template v-else>
        <div class="users-group-modal__header">
          <Typography class-name="fs-2 text-primary">
            {{
              usersGroupModalMode === 'CREATE'
                ? 'Создание группы'
                : 'Редактирование группы'
            }}
          </Typography>
          <Button
            variant="close"
            @click="emit('close-modal')"
          ></Button>
        </div>

        <Input
          name="name"
          class-name="h-50 rounded-end"
          label="Название группы:"
          validate-on-update
          placeholder="Введите название группы"
        />

        <UsersColumns
          :users="fields"
          :display-by="['lastName', 'firstName']"
          :email="'email'"
          :unselected-users="unselectedUsers"
          @on-select="selectUser"
          @on-unselect="unselectUser"
        />

        <Combobox
          name="roles"
          label="Выберите тип группы:"
          :options="groupRoles"
          placeholder="Тип группы"
          multiselect-placeholder="Выбрано"
        />

        <Button
          v-if="usersGroupModalMode === 'CREATE'"
          variant="primary"
          :is-loading="isCreating"
          @click="handleCreateGroup"
        >
          Добавить
        </Button>
        <Button
          v-else
          variant="primary"
          :is-loading="isUpdating"
          @click="handleUpdateGroup"
        >
          Сохранить изменения
        </Button>
      </template>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.users-group-modal {
  width: 600px;

  @include flexible(
    stretch,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }
}

.modal-layout-enter-from .users-group-modal,
.modal-layout-leave-to .users-group-modal {
  transform: scale(0.9);
}
</style>
