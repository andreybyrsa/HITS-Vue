<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import UsersGroupModal from '@Components/Modals/UsersGroupModal/UsersGroupModal.vue'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import UsersGroupsList from '@Components/Forms/UsersGroupsForm/UsersGroupsList.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import UsersGroup from '@Domain/UsersGroup'

import UsersGroupsService from '@Services/UsersGroupsService'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const usersGroups = ref<UsersGroup[]>()
const currentGroupId = ref()
const currentDeleteGroupId = ref()

const isOpenedCreatingGroupModal = ref(false)
const isOpenedUpdatingGroupModal = ref(false)
const isOpenedDeletingGroupModal = ref(false)

const searchedValue = ref('')

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const responseGroups = await UsersGroupsService.getUsersGroups(token)

    if (responseGroups instanceof Error) {
      return // notification
    }

    usersGroups.value = responseGroups
  }
})

const searchedUsersGroups = computed(() => {
  return usersGroups.value?.filter((group) => {
    const groupName = group.name.trim().toLowerCase()
    const currentSearchedValue = searchedValue.value.trim().toLowerCase()

    return groupName.includes(currentSearchedValue)
  })
})

function openCreatingGroupModal() {
  isOpenedCreatingGroupModal.value = true
}
function closeCreatingGroupModal() {
  isOpenedCreatingGroupModal.value = false
}

function openUpdatingGroupModal(groupId: number) {
  currentGroupId.value = groupId
  isOpenedUpdatingGroupModal.value = true
}
function closeUpdatingGroupModal() {
  isOpenedUpdatingGroupModal.value = false
}

function openDeletingGroupModal(groupId: number) {
  isOpenedDeletingGroupModal.value = true
  currentDeleteGroupId.value = groupId
}
function closeDeletingGroupModal() {
  isOpenedDeletingGroupModal.value = false
}

const handleDeleteGroup = async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await UsersGroupsService.deleteUsersGroup(
      currentDeleteGroupId.value,
      token,
    )

    if (response instanceof Error) {
      return // notification
    }

    usersGroups.value = usersGroups.value?.filter(
      (group) => group.id !== currentDeleteGroupId.value,
    )
  }
}
</script>

<template>
  <FormLayout class-name="users-group-form p-3 w-100 h-100 bg-white">
    <Typography class-name="fs-3 text-primary text-center w-100">
      Группы пользователей
    </Typography>

    <div class="w-50">
      <Input
        name="search"
        v-model="searchedValue"
        placeholder="Поиск группы пользователей"
      >
        <template #append>
          <Button
            class-name="px-2 py-0"
            @click="openCreatingGroupModal"
            prepend-icon-name="bi bi-plus-lg"
          >
            Добавить группу
          </Button>
        </template>
      </Input>
    </div>

    <UsersGroupsList
      :users-groups="searchedUsersGroups"
      @open-updating-group-modal="openUpdatingGroupModal"
      @open-deleting-group-modal="openDeletingGroupModal"
    />

    <UsersGroupModal
      :isOpened="isOpenedCreatingGroupModal"
      v-model="usersGroups"
      @close-modal="closeCreatingGroupModal"
    />
    <UsersGroupModal
      :isOpened="isOpenedUpdatingGroupModal"
      :users-group-id="currentGroupId"
      v-model="usersGroups"
      @close-modal="closeUpdatingGroupModal"
    />
    <DeleteModal
      :is-opened="isOpenedDeletingGroupModal"
      @delete="handleDeleteGroup"
      @close-modal="closeDeletingGroupModal"
    />
  </FormLayout>
</template>

<style lang="scss" scoped>
.users-group-form {
  @include flexible(center, flex-start, column, $gap: 16px);
}
</style>
