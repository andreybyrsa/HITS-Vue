<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import AddUsersGroup from '@Components/Modals/AddUsersGroupModal/AddUsersGroupModal.vue'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import UserGroup from '@Domain/Group'

import useNotification from '@Hooks/useNotification'

import useUserStore from '@Store/user/userStore'

import GroupService from '@Services/GroupsService'

import getRoles from '@Utils/getRoles'

const roles = getRoles()

const searchedValue = ref('')

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const groups = ref<UserGroup[]>([])
const groupModalTitle = ref('Добавить группу')
const openedGroup = ref<UserGroup>()
const isOpenedGroupModal = ref(false)

const currentGroupId = ref('')
const isOpenedDeleteModal = ref(false)

const { handleOpenNotification } = useNotification()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const responseGroups = await GroupService.getUsersGroups(token)

    if (responseGroups instanceof Error) {
      return handleOpenNotification('error', responseGroups.message)
    }

    groups.value = responseGroups
  }
})

const searchedGroup = computed(() => {
  return groups.value.filter((group) => {
    const groupName = group.name.trim().toLowerCase()
    const currentSearchedValue = searchedValue.value.trim().toLowerCase()

    return groupName.includes(currentSearchedValue)
  })
})

function openCreateGroupModal() {
  openedGroup.value = { id: '', name: '', users: [], role: 'INITIATOR' }
  groupModalTitle.value = 'Добавить группу'
  isOpenedGroupModal.value = true
}

function openEditGroupModal(group: UserGroup) {
  openedGroup.value = { ...group }
  groupModalTitle.value = 'Редактировать группу'
  isOpenedGroupModal.value = true
}

function closeGroupModal() {
  isOpenedGroupModal.value = false
}

function openDeleteGroupModal(id: string) {
  isOpenedDeleteModal.value = true
  currentGroupId.value = id
}

function handleCloseDeleteModal() {
  isOpenedDeleteModal.value = false
}

const handleDelete = async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await GroupService.deleteUsersGroup(currentGroupId.value, token)

    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }

    groups.value = groups.value.filter((group) => group.id !== currentGroupId.value)
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
            @click="openCreateGroupModal"
            prepend-icon-name="bi bi-plus-lg"
          >
            Добавить группу
          </Button>
        </template>
      </Input>
    </div>

    <div class="users-group-form__content w-100">
      <div
        v-for="(group, index) in searchedGroup"
        :key="index"
        class="edit-users-form__group px-3 py-2 border rounded-3 mb-2 w-100 row_group"
      >
        <div class="col d-grid">
          <Typography class-name="text-primary fs-4 ">
            {{ group.name }}
          </Typography>
          <Typography class-name="fs-6">
            {{ roles.translatedRoles[group.role] }}
          </Typography>
        </div>

        <Button
          class-name="users-group-form__edit-btn"
          prepend-icon-name="bi bi-pencil-square text-primary"
          @click="openEditGroupModal(group)"
        ></Button>
        <Button
          @click="openDeleteGroupModal(group.id)"
          prepend-icon-name="bi bi-trash-fill text-danger"
        ></Button>
      </div>
      <DeleteModal
        :is-opened="isOpenedDeleteModal"
        @delete="handleDelete"
        @close-modal="handleCloseDeleteModal"
      />
      <AddUsersGroup
        :isOpened="isOpenedGroupModal"
        :group-modal-title="groupModalTitle"
        :opened-group="openedGroup"
        v-model="groups"
        @close-modal="closeGroupModal"
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
