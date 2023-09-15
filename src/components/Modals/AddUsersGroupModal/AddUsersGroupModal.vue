<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import {
  AddUsersGroupModalProps,
  AddUsersGroupModalEmits,
} from '@Components/Modals/AddUsersGroupModal/AddUsersGroupModal.types'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'

import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import { User } from '@Domain/User'
import { UserGroup } from '@Domain/Group'

import useNotification from '@Hooks/useNotification'

import { useForm, useFieldArray } from 'vee-validate'
import GroupService from '@Services/GroupsService'
import ManageUsersService from '@Services/ManageUsersService'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'

const props = defineProps<AddUsersGroupModalProps>()
const emit = defineEmits<AddUsersGroupModalEmits>()

const users = ref<User[]>([])

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const unselectedUsers = ref<User[]>([])

// const selectedUsers = ref<User[]>([])

// const unselectedUsers = ref<User[]>([
//   {
//     token:
//       'eyJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiQURNSUCJJTklUSUFUT1IiXSwic3ViIjoiZmhqdkBtYWlsLmNvbSIsImlzcyI6ImxvY2FsaG9zdDozMDAwIiwiaWF0IjoxNjkzOTI0MTQ4LCJleHAiOjE2OTQwMTA1NDh9.m8ubC0ekCqmbHNBWEgPX4By5lVQ_F7F-ZlA2YFh-Mmw',
//     email: 'fhv@mail.com',
//     lastName: 'Че',
//     firstName: 'Пользователь',
//     roles: ['ADMIN', 'INITIATOR'],
//   },
//   {
//     token:
//       'eyJhbGciOiJIUzI1NiJ9.eyzY29wZXMiOlsiQURNSU4iLCJJTklUSUFUT1IiXSwic3ViIjoiZmhqdkBtYWlsLmNvbSIsImlzcyI6ImxvY2FsaG9zdDozMDAwIiwiaWF0IjoxNjkzOTI0MTQ4LCJleHAiOjE2OTQwMTA1NDh9.m8ubC0ekCqmbHNBWEgPX4By5lVQ_F7F-ZlA2YFh-Mmw',
//     email: 'fhjvv@mail.com',
//     lastName: 'Четный',
//     firstName: 'Пользователь1',
//     roles: ['ADMIN', 'INITIATOR'],
//   },
// ])

const editGroup = ref<UserGroup>()

const {
  notificationOptions,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const responseUsers = await ManageUsersService.getUsers(token)

    if (responseUsers instanceof Error) {
      return handleOpenNotification('error', responseUsers.message)
    }

    users.value = responseUsers
  }
})

const { setValues, handleSubmit, values } = useForm<UserGroup>({
  validationSchema: {
    name: (value: string) => value?.length > 0 || 'Поле не заполнено',
    users: (value: User[]) => value?.length > 0 || 'Выберите пользователя',
  },
})

const { fields, push, remove } = useFieldArray<User>('users')

watch(
  () => props.editingGroup,
  (editingGroup) => {
    if (editingGroup) {
      setValues({ ...editingGroup })
      editGroup.value = editingGroup
      unselectedUsers.value = users.value.filter((user) =>
        editingGroup.users?.every((groupUser) => groupUser.email !== user.email),
      )
    } else {
      setValues({
        name: '',
        users: [],
      })
      unselectedUsers.value = users.value
    }
  },
)

function selectUser(user: User, index: number) {
  push(user)
  unselectedUsers.value.splice(index, 1)
}

function unselectUser(user: User, index: number) {
  remove(index)
  unselectedUsers.value.push(user)
}

const handleCreate = handleSubmit(async (values) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await GroupService.createUsersGroup(values, token)

    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }
    handleOpenNotification('success', response.success)
    emit('close-modal')
    emit('save-group', values)
  }
})

const handleEdit = handleSubmit(async (values) => {
  const currentUser = user.value
  if (currentUser?.token && editGroup.value) {
    const { token } = currentUser
    const { id } = editGroup.value
    const response = await GroupService.editUsersGroup(values, token, id)
    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }
    handleOpenNotification('success', response.success)
    emit('close-modal')
    emit('edit-group', values)
  }
})

const handleDelete = async () => {
  const currentUser = user.value
  if (currentUser?.token && editGroup.value) {
    const { token } = currentUser
    const { id } = editGroup.value
    const response = await GroupService.deleteUsersGroup(values, token, id)
    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }
    handleOpenNotification('success', response.success)
    emit('close-modal')
    emit('delete-group', values.id)
  }
}

// const selectedUser = defineModel<UserGroup[]>('selectedUser', {
//   required: true,
// })
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="add-Users-group-modal p-3 bg-white rounded-3">
      <div class="add-Users-group-modal__header">
        <Typography class-name="fs-2 text-primary">{{ groupModalTitle }}</Typography>
        <Button
          class-name="btn-close"
          @click="emit('close-modal')"
        ></Button>
      </div>
      <Input
        name="name"
        class-name="fs-6 h-50"
        placeholder="Введите название группы"
      />

      <div class="d-flex justify-content-between">
        <div class="selectors">
          <Typography class-name="fs-6 text-primary"
            >Пользователи не в группе</Typography
          >
          <div class="select-block border">
            <div
              class="unselected-selected-usesrs"
              v-for="(user, index) in unselectedUsers"
              :key="index"
              @click="selectUser(user, index)"
            >
              <Typography class-name="m-2 fs-6">
                {{ user.lastName }}
              </Typography>
              <Typography class-name="fs-6">{{ user.firstName }}</Typography>

              <div class="unselected-selected-usesrs">
                <!-- <Checkbox
                  name="checkboxUser"
                  :label="user.lastName + user.firstName"
                  v-model="selectedUser"
                  :value="user"
                ></Checkbox> -->
              </div>
            </div>
          </div>
        </div>

        <div class="move-buttons m-2 flex-column">
          <Button
            prepend-icon-name="bi bi-arrow-left-right"
            class-name="shadow-sm bg-light min-vh-10 mb-4"
          ></Button>
          <Button class-name="shadow-sm bg-light min-vh-10">ALL</Button>
        </div>

        <div class="selectors">
          <Typography class-name="fs-6 text-primary"
            >Пользователи в группе</Typography
          >
          <div class="select-block border">
            <div
              class="unselected-selected-usesrs"
              v-for="(user, index) in fields"
              :key="index"
              @click="unselectUser(user.value, index)"
            >
              <Typography class-name="m-2 fs-6">
                {{ user.value.lastName }}
              </Typography>
              <Typography class-name="fs-6">{{ user.value.firstName }}</Typography>
            </div>
          </div>
        </div>
      </div>
      <div v-if="groupModalTitle == 'Добавить группу'">
        <Button
          class-name="btn-primary w-100"
          @click="handleCreate"
          >Добавить</Button
        >
      </div>
      <div
        class="w-100 d-flex gap-2"
        v-if="groupModalTitle == 'Редактировать группу'"
      >
        <Button
          class-name="btn-danger w-50"
          @click="handleDelete"
          >Удалить</Button
        >
        <Button
          class-name="btn-primary w-50"
          @click="handleEdit"
          >Редактировать</Button
        >
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.add-Users-group-modal {
  width: 600px;

  @include flexible(
    stretch,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  &__header {
    @include flexible(center, space-between);
  }

  transition: all $default-transition-settings;
}

.modal-layout-enter-from .filter-modal,
.modal-layout-leave-to .filter-modal {
  transform: scale(0.9);
}

.list-group {
  max-height: 400px;
  overflow-y: scroll;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgb(209, 209, 209);
  border-radius: 20px;
}

::-webkit-scrollbar-thumb {
  background-color: #0d6efd;
  border-radius: 20px;
  border: 3px solid #0d6efd;
}

.list-group-item {
  display: flex;
  width: 100%;
}

.choose-user {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.selectors {
  width: 48%;
}

.select-block {
  border-radius: 12px;
  height: 250px;
  overflow-y: scroll;
}

.unselected-selected-usesrs {
  cursor: pointer;
  margin: 8px;
}

.move-buttons {
  @include flexible(center, center, columns);
}
</style>
