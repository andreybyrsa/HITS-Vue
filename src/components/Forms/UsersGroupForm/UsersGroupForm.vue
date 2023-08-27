<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import AddUsersGroup from '@Components/Modals/AddUsersGroupModal/AddUsersGroupModal.vue'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import { User } from '@Domain/User'
import GroupService from '@Services/GroupsService'
import ManageUsersService from '@Services/ManageUsersService'
import useNotification from '@Hooks/useNotification'

import { UserGroup, UpdateUserGroup } from '@Domain/Group'
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

    usersarray.value = responseUsers.users
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

function openEditGroupModal(id: number) {
  const currentSelectedUsers = usersGroup.value.find((users) => users.id == id)

  if (currentSelectedUsers) {
    const { id, name, users } = currentSelectedUsers
    editingGroup.value = {
      id: id,
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
      id: id,
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
  <FormLayout class-name="users-group-form p-3">
    <Typography class-name="fs-3 text-primary text-center w-100"
      >Группы пользователей</Typography
    >
    {{ usersarray }}
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
    <div class="users-group-form__contetnt w-100">
      <div
        v-for="(users, index) in searchedGroup"
        :key="index"
        class="edit-users-form__group px-3 py-2 border rounded-3 mb-2 row"
      >
        <Typography class-name="text-primary fs-4 col">{{
          users.name
        }}</Typography>
        <Button
          class-name="users-group-form__edit-btn col-1"
          prepend-icon-name="bi bi-pencil-square text-primary"
          @click="openEditGroupModal"
        ></Button>
      </div>
      <AddUsersGroup
        :isOpened="isOpenedEditGroup"
        :currentAddUsersGroup="currentAddUsersGroup"
        :group="group"
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
  width: 100%;
  height: 100%;
  background-color: $white-color;

  @include flexible(center, flex-start, column, $gap: 16px);

  &__content {
    max-height: 100%;

    overflow-y: scroll;

    @include flexible(stretch, flex-start, column, $gap: 8px);
  }
  &__group {
    width: 100%;
    @include flexible(space-between, center);
  }
  &__edit-btn {
    display: flex;
    justify-content: end;
  }
}
</style>
