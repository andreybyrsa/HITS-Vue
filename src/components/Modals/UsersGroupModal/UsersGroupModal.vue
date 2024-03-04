<script lang="ts" setup>
import { ref, onMounted, onUpdated } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm, useFieldArray } from 'vee-validate'
import { User, RolesTypes, UsersGroup } from '@Domain'
import { useUserStore, useNotificationsStore } from '@Store'
import { UsersGroupsService, ManageUsersService } from '@Service'
import { validation, getUserRolesInfo } from '@Utils'
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

const groupRoles = getUserRolesInfo().roles

const usersGroupModalMode = ref<'CREATE' | 'UPDATE'>('CREATE')

onMounted(async () => {
  const responseUsers = await ManageUsersService.getUsers()

  if (responseUsers instanceof Error) {
    return notificationsStore.createSystemNotification(
      'Система',
      responseUsers.message,
    )
  }

  users.value = responseUsers
})

const { setValues, handleSubmit } = useForm<UsersGroup>({
  validationSchema: {
    name: (value: string) =>
      validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    users: (value: User[]) =>
      validation.checkIsEmptyValue(value) || 'Выберите пользователей',
    roles: (value: RolesTypes[]) =>
      validation.checkIsEmptyValue(value) || 'Выберите тип группы',
  },
  initialValues: { roles: [] },
})

const { fields, push, remove } = useFieldArray<User>('users')

onUpdated(async () => {
  if (props.usersGroupId !== undefined && props.isOpened) {
    const { usersGroupId } = props

    isLoadingGroup.value = true
    const response = await UsersGroupsService.getUsersGroup(usersGroupId)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    setValues({ ...response })
    unselectedUsers.value = users.value.filter((user) =>
      response.users.every((groupUser) => groupUser.id !== user.id),
    )
    usersGroupModalMode.value = 'UPDATE'

    isLoadingGroup.value = false
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
  isCreating.value = true
  const response = await UsersGroupsService.createUsersGroup(values)
  isCreating.value = false

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  usersGroups.value.push(response)

  notificationsStore.createSystemNotification('Система', 'Группа успешно создана')
  emit('close-modal')
})

const handleUpdateGroup = handleSubmit(async (values) => {
  const { id } = values

  isUpdating.value = true
  const response = await UsersGroupsService.updateUsersGroup(values, id)
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
          :unselected-users="unselectedUsers"
          unselected-users-label="Пользователи:"
          selected-users-label="Пользователи в группе:"
          @selectUser="selectUser"
          @unselect-user="unselectUser"
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
@Utils/validation
