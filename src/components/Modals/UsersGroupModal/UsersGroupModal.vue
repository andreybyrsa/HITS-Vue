<script lang="ts" setup>
import { computed, ref, onMounted, onUpdated } from 'vue'
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
import { getUserRolesInfo } from '@Utils/userRolesInfo'

import UsersGroupsService from '@Services/UsersGroupsService'
import ManageUsersService from '@Services/ManageUsersService'

import useUserStore from '@Store/user/userStore'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import Validation from '@Utils/Validation'

const notificationsStore = useNotificationsStore()

const props = defineProps<UsersGroupModalProps>()
const emit = defineEmits<UsersGroupModalEmits>()

const groupRoles = getUserRolesInfo().roles

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

const selectedUsersCount = computed(() => fields.value.length)

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

function selectUser(user: User) {
  const selectedUserIndex = unselectedUsers.value.findIndex(
    ({ id }) => id === user.id,
  )

  if (selectedUserIndex !== -1) {
    push(user)
    unselectedUsers.value.splice(selectedUserIndex, 1)
  }
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
          <Typography class-name="fs-2 text-primary border-bottom">
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

        <div class="users-group-modal__content">
          <div class="left-content">
            <UsersColumns
              :users="fields"
              :unselected-users="unselectedUsers"
              unselected-users-label="Пользователи:"
              :selected-users-label="'Выбранных: ' + selectedUsersCount"
              @selectUser="selectUser"
              @unselect-user="unselectUser"
            />
          </div>
          <div class="right-content">
            <Input
              class="right-content-item"
              name="name"
              class-name="h-50 rounded-end"
              label="Название группы:"
              validate-on-update
              placeholder="Введите название группы"
            />
            <Combobox
              name="roles"
              label="Выберите тип группы:"
              :options="groupRoles"
              placeholder="Тип группы"
              multiselect-placeholder="Выбрано"
            />

            <Button
              class="right-content-item"
              v-if="usersGroupModalMode === 'CREATE'"
              variant="primary"
              :is-loading="isCreating"
              @click="handleCreateGroup"
            >
              Добавить группу
            </Button>
            <Button
              class="right-content-item"
              v-else
              variant="primary"
              :is-loading="isUpdating"
              @click="handleUpdateGroup"
            >
              Сохранить изменения
            </Button>
          </div>
        </div>
      </template>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.users-group-modal {
  width: 1000px;
  height: 550px;

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

  &__content {
    @include flexible;
    justify-content: space-between;

    .left-content {
      flex: 1;
      padding-bottom: 10px;
    }

    .right-content {
      flex: 1;
      margin-left: 20px;
      width: 100px;
      display: grid;
    }
  }
}
.right-content-item {
  margin-bottom: 20px;
}

.modal-layout-enter-from .users-group-modal,
.modal-layout-leave-to .users-group-modal {
  transform: scale(0.9);
}

.selected-roles {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.selected-roles > div {
  padding: 5px;
  border-radius: 20px;
  background-color: rgb(177, 204, 255);
  color: #0d6efd;
}
</style>
