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

const selectedUsers = ref<User[]>([])

const unselectedUsers = ref<User[]>([
  {
    token:
      'eyJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiQURNSUCJJTklUSUFUT1IiXSwic3ViIjoiZmhqdkBtYWlsLmNvbSIsImlzcyI6ImxvY2FsaG9zdDozMDAwIiwiaWF0IjoxNjkzOTI0MTQ4LCJleHAiOjE2OTQwMTA1NDh9.m8ubC0ekCqmbHNBWEgPX4By5lVQ_F7F-ZlA2YFh-Mmw',
    email: 'fhv@mail.com',
    lastName: 'Че',
    firstName: 'Пользователь',
    roles: ['ADMIN', 'INITIATOR'],
  },
  {
    token:
      'eyJhbGciOiJIUzI1NiJ9.eyzY29wZXMiOlsiQURNSU4iLCJJTklUSUFUT1IiXSwic3ViIjoiZmhqdkBtYWlsLmNvbSIsImlzcyI6ImxvY2FsaG9zdDozMDAwIiwiaWF0IjoxNjkzOTI0MTQ4LCJleHAiOjE2OTQwMTA1NDh9.m8ubC0ekCqmbHNBWEgPX4By5lVQ_F7F-ZlA2YFh-Mmw',
    email: 'fhjvv@mail.com',
    lastName: 'Четный',
    firstName: 'Пользователь1',
    roles: ['ADMIN', 'INITIATOR'],
  },
])

const {
  notificationOptions,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

const { push, remove } = useFieldArray<User>('user')

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

// const selectUser = (user: any) => {
//   selectedUsers.value.push(user)
//   unselectedUsers.splice(unselectedUsers.indexOf(user), 1)
// }

// const unselectUser = (user: any) => {
//   selectedUsers.value.splice(selectedUsers.value.indexOf(user), 1)
//   unselectedUsers.push(user)
// }

const { setValues, handleSubmit } = useForm<UserGroup>({
  validationSchema: {
    name: (value: string) => value?.length > 0 || 'Поле не заполнено',
    users: (value: User[]) => value?.length > 0 || 'Выберите пользователя',
  },
})

// watch(
//   () => props.editingGroup,
//   (editingGroup) => {
//     if (editingGroup && editingGroup.newName) {
//       setFieldValue('name', editingGroup.newName)
//     }
//   },
// )

// watch(
//   () => props.isOpened,
//   () => console.log(1),
// )

//юзеров подгрузили вначале, когда создать группы модал, сработал вотч, сработало добавить группу тайтл,
//потом в модалке селектед и не селектед, создаем группу, если добавить группу, то не селектед, то unselected = users, selected = [],
//второе условие: когда происходит редактирование, передаем группу в едитинг групп, в форме вытаскивали сетвельюс функция, надо взять ее и туда через ... пропс.едитинггрупп
//форма заполнилась
//селектед сразу присвоить едининггрупп.юзерс, анселектед фильтр по массиву(по пользователям)
//надо сделать две кнопки, по условию выводить:и если тайтл добавить, то добавть, если редактировать - редактировать, у каждой кнопки своя функция
//написать сервис для функции редактирования
//написать хендледит функцию по хендлсабмит, хендлкриейт типа того же
watch(
  () => props.editingGroup,
  (editingGroup) => {
    if (editingGroup) {
      setValues({ ...editingGroup })
      selectedUsers.value = editingGroup.users
      unselectedUsers.value = users.value.filter((user) =>
        editingGroup.users?.every((groupUser) => groupUser.email !== user.email),
      )
    } else {
      setValues({
        name: '',
        users: [],
      })
      unselectedUsers.value = users.value
      selectedUsers.value = []
    }
  },
)

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
  }
})

const handleEdit = handleSubmit(async (values) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await GroupService.editUsersGroup(values, token)
    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }
    handleOpenNotification('success', response.success)
    emit('close-modal')
  }
})

const selectedUser = defineModel<UserGroup[]>('selectedUser', {
  required: true,
})
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
              v-for="(user, index) in unselectedUsers"
              :key="index"
            >
              <div class="unselected-selected-usesrs">
                <Checkbox
                  name="checkboxUser"
                  :label="user.lastName + user.firstName"
                  v-model="selectedUser"
                  :value="user"
                ></Checkbox>
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
              @click="unselectUser(user)"
              v-for="(user, index) in selectedUsers"
              :key="index"
            >
              <div class="unselected-selected-usesrs">
                <Typography class-name="m-2 fs-6">
                  {{ user.lastName }}
                </Typography>
                <Typography class-name="fs-6">{{ user.firstName }}</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="groupModalTitle == 'Добавить группу'">
        <Button
          class-name="btn-primary w-100"
          @click="handleCreate()"
          >Добавить</Button
        >
      </div>
      <div v-if="groupModalTitle == 'Редактировать группу'">
        <Button
          class-name="btn-primary w-100"
          @click="handleEdit()"
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
