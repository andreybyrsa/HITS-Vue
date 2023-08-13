<script lang="ts" setup>
import { ref, onMounted, computed, reactive } from 'vue'

import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import EditUserModal from '@Components/Modals/EditUserModal/EditUserModal.vue'
import Typography from '@Components/Typography/Typography.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { User } from '@Domain/User'
import { UpdateUserData } from '@Domain/ManageUsers'
import ResponseMessage from '@Domain/ResponseMessage'

import ManageUsersService from '@Services/ManageUsersService'

const isOpenUserModal = ref(false)

const currentUsers = ref<User[]>([])
const editingUser = ref<User>()
const searchedValue = ref('')

const response = reactive<ResponseMessage>({
  error: '',
})

onMounted(async () => {
  const { users, error } = await ManageUsersService.getUsers()

  if (users) {
    currentUsers.value = users
  } else {
    response.error = error
  }
})

const searchedUsers = computed(() => {
  return currentUsers.value.filter((user) => {
    const userEmail = user.email.toLowerCase().trim()
    const currentSearchedValue = searchedValue.value.toLowerCase().trim()

    return userEmail.includes(currentSearchedValue)
  })
})

function handleOpenModal(email: string) {
  isOpenUserModal.value = true
  editingUser.value = {
    ...currentUsers.value.find((user) => user.email === email),
  } as User
}

function handleCloseModal(newUser?: UpdateUserData) {
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
  }
}
</script>

<template>
  <FormLayout class-name="edit-users-form">
    <Typography class-name="fs-2 text-primary text-center w-100">
      Редактирование пользователей
    </Typography>

    <div class="w-50">
      <Input
        name="search"
        v-model="searchedValue"
        placeholder="Поиск по почте"
      >
        <template #prepend>
          <i class="bi bi-search"></i>
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
        </div>

        <Button
          icon-name="bi bi-pencil-square text-primary"
          @click="handleOpenModal(user.email)"
        ></Button>
      </div>

      <Typography
        v-if="response.error"
        class-name="text-danger text-center"
      >
        {{ response.error }}
      </Typography>
    </div>

    <EditUserModal
      :is-opened="isOpenUserModal"
      @close-modal="handleCloseModal"
      :user="editingUser"
    />
  </FormLayout>
</template>

<style lang="scss">
.edit-users-form {
  width: 100%;
  height: 100%;

  @include flexible(center, flex-start, column, $gap: 16px);

  &__content {
    max-height: 100%;

    overflow-y: scroll;

    @include flexible(stretch, flex-start, column, $gap: 8px);
  }

  &__user {
    @include flexible(center, space-between);
  }
}
</style>
