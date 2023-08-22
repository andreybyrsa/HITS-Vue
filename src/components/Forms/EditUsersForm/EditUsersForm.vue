<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import EditUserModal from '@Components/Modals/EditUserModal/EditUserModal.vue'
import Typography from '@Components/Typography/Typography.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

import { User } from '@Domain/User'
import { UpdateUserData } from '@Domain/ManageUsers'
import RolesTypes from '@Domain/Roles'

import useNotification from '@Hooks/useNotification'

import useUserStore from '@Store/user/userStore'

import ManageUsersService from '@Services/ManageUsersService'

import getRoles from '@Utils/getRoles'

const isOpenUserModal = ref(false)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const currentUsers = ref<User[]>([])
const editingUser = ref<UpdateUserData>()
const searchedValue = ref('')

const availableRoles = getRoles()
const filteredRoles = ref<RolesTypes[]>([])

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
    const response = await ManageUsersService.getUsers(token)

    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }

    currentUsers.value = response.users
  }
})

function getCurrentRoleColor(role: RolesTypes) {
  if (role === 'ADMIN') {
    return 'text-danger'
  }
  return 'text-secondary'
}

const searchedUsers = computed(() => {
  return currentUsers.value.filter((user) => {
    const userEmail = user.email.toLowerCase().trim()
    const currentSearchedValue = searchedValue.value.toLowerCase().trim()

    const isIncludesSearcheValue = userEmail.includes(currentSearchedValue)

    if (filteredRoles.value.length) {
      return (
        filteredRoles.value.some((role) => user.roles.includes(role)) &&
        isIncludesSearcheValue
      )
    }

    return isIncludesSearcheValue
  })
})

function handleOpenModal(email: string) {
  const selectedUser = currentUsers.value.find((user) => user.email === email)

  if (selectedUser) {
    const { email, firstName, lastName, roles } = selectedUser
    editingUser.value = {
      email: email,
      newEmail: email,
      newFirstName: firstName,
      newLastName: lastName,
      newRoles: roles,
    }

    isOpenUserModal.value = true
  }
}

function handleCloseModal(newUser?: UpdateUserData, success?: string) {
  isOpenUserModal.value = false

  if (newUser) {
    const { email, newEmail, newFirstName, newLastName, newRoles } = newUser
    const newUserData: User = {
      email: newEmail,
      firstName: newFirstName,
      lastName: newLastName,
      roles: newRoles,
    }

    currentUsers.value.forEach((user, index) => {
      if (email === user.email) {
        currentUsers.value.splice(index, 1, newUserData)
      }
    })

    handleOpenNotification('success', success)
  }
}
</script>

<template>
  <form class="edit-users-form p-3">
    <Typography class-name="fs-2 text-primary text-center w-100">
      Редактирование пользователей
    </Typography>

    <div class="w-50">
      <Input
        name="search"
        v-model="searchedValue"
        placeholder="Поиск по почте"
      >
        <template #append>
          <Button
            class-name="px-2 py-0"
            append-icon-name="bi bi-chevron-down"
            is-drop-down-controller
            drop-down-clickable-inside
          >
            Роли
          </Button>

          <DropDown>
            <template
              v-for="(role, index) in availableRoles.roles"
              :key="index"
            >
              <Checkbox
                name="checkboxRole"
                :label="availableRoles.translatedRoles[role]"
                v-model="filteredRoles"
                :value="role"
              />
            </template>
          </DropDown>
        </template>
      </Input>
    </div>

    <div class="edit-users-form__content w-100">
      <div
        v-for="(user, index) in searchedUsers"
        :key="index"
        class="edit-users-form__user px-3 py-2 border rounded-3"
      >
        <div class="d-flex flex-column">
          <Typography class-name="text-primary fs-5">
            {{ user.email }}
          </Typography>
          <Typography>{{ user.firstName }} {{ user.lastName }}</Typography>

          <div class="edit-users-form__roles">
            <Typography
              v-for="(role, index) in user.roles"
              :key="index"
              :class-name="`fs-6 ${getCurrentRoleColor(role)}`"
            >
              {{ availableRoles.translatedRoles[role] }}
            </Typography>
          </div>
        </div>

        <Button
          prepend-icon-name="bi bi-pencil-square text-primary"
          @click="handleOpenModal(user.email)"
        ></Button>
      </div>

      <NotificationModal
        :type="notificationOptions.type"
        :is-opened="isOpenedNotification"
        @close-modal="handleCloseNotification"
        :time-expired="5000"
      >
        {{ notificationOptions.message }}
      </NotificationModal>
    </div>

    <EditUserModal
      :is-opened="isOpenUserModal"
      @close-modal="handleCloseModal"
      :user="editingUser"
    />
  </form>
</template>

<style lang="scss" scoped>
.edit-users-form {
  width: 100%;
  height: 100%;
  background-color: $white-color;

  @include flexible(center, flex-start, column, $gap: 16px);

  &__content {
    max-height: 100%;

    overflow-y: scroll;

    @include flexible(stretch, flex-start, column, $gap: 8px);
  }

  &__user {
    @include flexible(center, space-between);
  }

  &__roles {
    @include flexible(center, flex-start, $gap: 8px);
  }
}
</style>
