<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

import EditUserModal from '@Components/Modals/EditUserModal/EditUserModal.vue'
import Typography from '@Components/Typography/Typography.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'
import SearchUsers from '@Components/Forms/EditUsersForm/SearchUsers.vue'
import UsersList from '@Components/Forms/EditUsersForm/UsersList.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'

import { User } from '@Domain/User'
import { UpdateUserData } from '@Domain/ManageUsers'
import RolesTypes from '@Domain/Roles'

import useNotification from '@Hooks/useNotification'

import useUserStore from '@Store/user/userStore'

import ManageUsersService from '@Services/ManageUsersService'

const isOpenUserModal = ref(false)
const isLoading = ref(true)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const currentUsers = ref<User[]>([])
const editingUser = ref<UpdateUserData>()

const searchedValue = ref('')
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
    isLoading.value = false
  }
})

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

function handleCloseModal() {
  isOpenUserModal.value = false
}

function handleSaveUser(newUser: UpdateUserData, success: string) {
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

    <SearchUsers
      v-model:searchedValue="searchedValue"
      v-model:filteredRoles="filteredRoles"
    />

    <div class="edit-users-form__content w-100">
      <template v-if="isLoading">
        <LoadingPlaceholder
          v-for="value in 3"
          :key="value"
          height="medium"
        />
      </template>
      <UsersList
        v-else
        :searched-users="searchedUsers"
        @open-edit-modal="handleOpenModal"
      />

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
      :user="editingUser"
      @save-user="handleSaveUser"
      @close-modal="handleCloseModal"
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
}
</style>
