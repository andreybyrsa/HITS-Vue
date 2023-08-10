<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import Button from '@Components/Button/Button.vue'
import EditUserModal from '@Components/Modals/EditUserModal/EditUserModal.vue'
import Typography from '@Components/Typography/Typography.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { User } from '@Domain/User'

import ManageUsersService from '@Services/ManageUsersService'

const isOpenUserModal = ref(false)

const users = ref<User[]>()
const editingUser = ref()

onMounted(async () => {
  users.value = await ManageUsersService.getUsers()
})

function handleOpenModal(token: string) {
  isOpenUserModal.value = true
  editingUser.value = { ...users.value?.find((user) => user.token === token) }
}

function handleCloseModal(newUser?: User) {
  isOpenUserModal.value = false

  if (newUser?.token) {
    users.value?.forEach((user, index) => {
      if (user.token === newUser.token) {
        users.value?.splice(index, 1, newUser)
      }
    })
  }
}
</script>

<template>
  <FormLayout class-name="edit-users-form">
    <Typography class-name="fs-3 text-primary">
      Редактирование пользователей
    </Typography>

    <div class="edit-users-form__content w-100">
      <template v-if="users?.length">
        <div
          v-for="user in users"
          :key="user.token"
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
            @click="handleOpenModal(user.token)"
          ></Button>
        </div>
      </template>

      <Typography
        v-else
        class-name="text-danger"
      >
        Ошибка загрузки пользователей
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
  width: 500px;

  @include flexible(center, flex-start, column, $gap: 16px);

  &__content {
    max-height: 400px;

    overflow-y: scroll;

    @include flexible(stretch, flex-start, column, $gap: 8px);
  }

  &__user {
    @include flexible(center, space-between);
  }
}
</style>
