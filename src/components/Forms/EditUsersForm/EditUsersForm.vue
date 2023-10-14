<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

import EditUserModal from '@Components/Modals/EditUserModal/EditUserModal.vue'
import Typography from '@Components/Typography/Typography.vue'
import SearchUsers from '@Components/Forms/EditUsersForm/SearchUsers.vue'
import UsersList from '@Components/Forms/EditUsersForm/UsersList.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'

import { User } from '@Domain/User'
import RolesTypes from '@Domain/Roles'

import useUserStore from '@Store/user/userStore'

import ManageUsersService from '@Services/ManageUsersService'

const isOpenUserModal = ref(false)
const isLoading = ref(true)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const currentUsers = ref<User[]>([])
const editingUser = ref<User>()

const searchedValue = ref('')
const filteredRoles = ref<RolesTypes[]>([])

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await ManageUsersService.getUsers(token)

    if (response instanceof Error) {
      return // notification
    }

    currentUsers.value = response
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

function handleOpenModal(id: string) {
  const selectedUser = currentUsers.value.find((user) => user.id === id)

  if (selectedUser) {
    editingUser.value = { ...selectedUser }

    isOpenUserModal.value = true
  }
}

function handleCloseModal() {
  isOpenUserModal.value = false
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
    </div>

    <EditUserModal
      :is-opened="isOpenUserModal"
      :user="editingUser"
      v-model="currentUsers"
      @close-modal="handleCloseModal"
    />
  </form>
</template>

<style lang="scss" scoped>
.edit-users-form {
  width: 100%;
  height: 100%;
  background-color: $white-color;

  @include flexible(center, flex-start, column, $gap: 12px);

  &__content {
    max-height: 100%;

    overflow-y: scroll;

    @include flexible(stretch, flex-start, column, $gap: 12px);
  }
}
</style>
