<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import AddUsersGroup from '@Components/Modals/AddUsersGroupModal/AddUsersGroupModal.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { User } from '@Domain/User'

import useNotification from '@Hooks/useNotification'

import ManageUsersService from '@Services/ManageUsersService'

import useUserStore from '@Store/user/userStore'

import { UserGroup, UpdateUserGroup } from '@Domain/Group'

import GroupService from '@Services/GroupsService'

const searchedValue = ref('')

const isOpenedAddGroup = ref(false)
const isOpenedEditGroup = ref(false)
const currentAddUsersGroup = ref([] as string[])

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const usersarray = ref<User[]>([])
const group = ref<UserGroup>()

const {
  notificationOptions,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

function openAddGroupModal() {
  isOpenedAddGroup.value = true
}

function closeAddGroupModal() {
  isOpenedAddGroup.value = false
}

const usersGroup = ref<UserGroup[]>([])

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const responseUsers = await ManageUsersService.getUsers(token)
    const responseGroups = await GroupService.getUsersGroups(token)

    if (responseUsers instanceof Error) {
      return handleOpenNotification('error', responseUsers.message)
    }
    if (responseGroups instanceof Error) {
      return handleOpenNotification('error', responseGroups.message)
    }

    usersarray.value = responseUsers
    usersGroup.value = responseGroups
  }
})

const searchedGroup = computed(() => {
  return usersGroup.value.filter((users) => {
    const groupName = users.name?.toLowerCase().trim()
    const currentSearchedValue = searchedValue.value?.toLowerCase().trim()

    const isIncludesSearcheValue =
      groupName && groupName.includes(currentSearchedValue)

    return isIncludesSearcheValue
  })
})

const editingGroup = ref<UpdateUserGroup>()

function openEditGroupModal(id: string) {
  const currentSelectedUsers = usersGroup.value.find((group) => group.id == id)

  if (currentSelectedUsers) {
    const { id, name, users } = currentSelectedUsers
    editingGroup.value = {
      id,
      newName: name,
      newUsers: users,
    }

    isOpenedEditGroup.value = true
  }
}

function closeEditGroupModal(
  newGroupOrSuccess?: UpdateUserGroup | string,
  success?: string,
): void {
  isOpenedEditGroup.value = false

  if (typeof newGroupOrSuccess === 'object') {
    const { id, newName, newUsers } = newGroupOrSuccess
    const newGroupData: UserGroup = {
      id,
      name: newName,
      users: newUsers,
    }

    usersGroup.value.forEach((group, index) => {
      if (group.id === id) {
        usersGroup.value.splice(index, 1, newGroupData)
      }
    })
  }

  if (success) {
    handleOpenNotification('success', success)
  }
}
</script>

<template>
  <FormLayout class-name="users-group-form p-3 w-100 h-100 bg-white">
    <Typography class-name="fs-3 text-primary text-center w-100"
      >Группы пользователей</Typography
    >
    <!-- {{ usersarray }} -->
    <div class="w-50">
      <Input
        name="search"
        v-model="searchedValue"
        placeholder="Поиск группы пользователей"
      >
        <template #append>
          <Button
            class-name="px-2 py-0"
            @click="openAddGroupModal"
            prepend-icon-name="bi bi-plus-lg"
            >Добавить группу
          </Button>
        </template>
      </Input>
      <div v-if="isOpenedAddGroup">
        <AddUsersGroup
          :isOpened="isOpenedAddGroup"
          :currentAddUsersGroup="currentAddUsersGroup"
          @close-modal="closeAddGroupModal"
          :usersarray="usersarray"
          v-model="usersGroup"
        >
        </AddUsersGroup>
      </div>
    </div>
    <div class="users-group-form__content w-100">
      <div
        v-for="(group, index) in searchedGroup"
        :key="index"
        class="edit-users-form__group px-3 py-2 border rounded-3 mb-2 w-100 row_group"
      >
        <Typography class-name="text-primary fs-4 col">
          {{ group.name }}
        </Typography>
        {{ usersGroup }}
        <Button
          class-name="users-group-form__edit-btn col-1"
          prepend-icon-name="bi bi-pencil-square text-primary"
          @click="openEditGroupModal(group.id)"
        ></Button>
      </div>
      <AddUsersGroup
        :isOpened="isOpenedEditGroup"
        :group="editingGroup"
        :usersarray="usersarray"
        @close-modal="closeEditGroupModal"
        v-model="usersGroup"
      >
      </AddUsersGroup>
    </div>
  </FormLayout>
</template>

<style lang="scss" scoped>
.users-group-form {
  @include flexible(center, flex-start, column, $gap: 16px);

  &__content {
    max-height: 100%;

    overflow-y: scroll;

    @include flexible(stretch, flex-start, column, $gap: 8px);
  }

  &__group {
    @include flexible(space-between, center);
    --bs-gutter-x: 0;
  }

  &__edit-btn {
    @include flexible(flex-start, end);
  }
}

.row_group {
  --bs-gutter-x: 0;
  --bs-gutter-y: 0;
  display: flex;
  flex-wrap: wrap;
  margin-top: calc(-1 * var(--bs-gutter-y));
  margin-right: calc(-0.5 * var(--bs-gutter-x));
  margin-left: calc(-0.5 * var(--bs-gutter-x));
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
</style>
