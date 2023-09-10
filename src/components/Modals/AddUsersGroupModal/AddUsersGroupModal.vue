<script lang="ts" setup>
import { ref, watch } from 'vue'
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

import { useForm } from 'vee-validate'
import { UserGroupData } from '@Domain/ManageUsers'
import GroupService from '@Services/GroupsService'

const props = defineProps<AddUsersGroupModalProps>()
const emit = defineEmits<AddUsersGroupModalEmits>()

const groups = defineModel<UserGroup[]>({ required: true })

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const {
  notificationOptions,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

//const { fields, push, remove } = useFieldArray<User>('user')

const selectedUsers = ref<User[]>([])

const unselectedUsers = props.usersarray.filter(
  (users) => !selectedUsers.value.includes(users),
)

const selectUser = (user: any) => {
  selectedUsers.value.push(user)
  unselectedUsers.splice(unselectedUsers.indexOf(user), 1)
}

const unselectUser = (user: any) => {
  selectedUsers.value.splice(selectedUsers.value.indexOf(user), 1)
  unselectedUsers.push(user)
}

watch(
  () => selectedUsers.value,
  (newSelectedUsers) => {
    newSelectedUsers.forEach((user) => {
      if (!values.users.includes(user)) {
        values.users.push(user)
      }
    })
  },
)

const { errors, setValues, handleSubmit, values } = useForm<UserGroupData>({
  validationSchema: {
    name: (value: string) => value?.length > 0 || 'Поле не заполнено',
    //users: (value: User[]) => value?.length > 0 || 'Выберите пользователя',
  },
})
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
    groups.value.push(values)
  }
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="add-Users-group-modal p-3 bg-white rounded-3">
      <div class="add-Users-group-modal__header">
        <Typography class-name="fs-2 text-primary">Добавить группу</Typography>
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
              @click="selectUser(user)"
              v-for="(user, index) in unselectedUsers"
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

      <Button
        class-name="btn-primary w-100"
        @click="handleCreate()"
        >Добавить</Button
      >
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
}
</style>
