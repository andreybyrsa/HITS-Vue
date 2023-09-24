<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import UsersGroupModal from '@Components/Modals/UsersGroupModal/UsersGroupModal.vue'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import NotificationModal from '@Components/Modals/NotificationModal/NotificationModal.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import UsersGroup from '@Domain/UsersGroup'

import useNotification from '@Hooks/useNotification'

import useUserStore from '@Store/user/userStore'

import UsersGroupsService from '@Services/UsersGroupsService'

import getRoles from '@Utils/getRoles'

const roles = getRoles()

const searchedValue = ref('')

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const usersGroups = ref<UsersGroup[]>([])
const groupModalTitle = ref('Добавить группу')
const openedGroup = ref<UsersGroup>()
const isOpenedGroupModal = ref(false)

const currentGroupId = ref('')
const isOpenedDeleteModal = ref(false)

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
    const responseGroups = await UsersGroupsService.getUsersGroups(token)

    if (responseGroups instanceof Error) {
      return handleOpenNotification('error', 'Ошибка получения групп')
    }

    usersGroups.value = responseGroups
  }
})

const searchedUsersGroups = computed(() => {
  return usersGroups.value.filter((group) => {
    const groupName = group.name.trim().toLowerCase()
    const currentSearchedValue = searchedValue.value.trim().toLowerCase()

    return groupName.includes(currentSearchedValue)
  })
})

function openCreateGroupModal() {
  openedGroup.value = { id: '', name: '', users: [], roles: [] }
  groupModalTitle.value = 'Добавить группу'
  isOpenedGroupModal.value = true
}

function openEditGroupModal(group: UsersGroup) {
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

const handleDeleteGroup = async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await UsersGroupsService.deleteUsersGroup(
      currentGroupId.value,
      token,
    )

    if (response instanceof Error) {
      return handleOpenNotification('error', 'Ошибка удаления группы')
    }

    usersGroups.value = usersGroups.value.filter(
      (group) => group.id !== currentGroupId.value,
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
        v-for="(group, index) in searchedUsersGroups"
        :key="index"
        class="edit-users-form__group px-3 py-2 border rounded-3 mb-2 w-100 row_group"
      >
        <div class="col d-grid">
          <Typography class-name="text-primary fs-4 ">
            {{ group.name }}
          </Typography>
          <div class="d-flex gap-3">
            <Typography
              v-for="role in group.roles"
              :key="role"
              class-name="fs-6"
            >
              {{ roles.translatedRoles[role] }}
            </Typography>
          </div>
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
        @delete="handleDeleteGroup"
        @close-modal="handleCloseDeleteModal"
      />
      <UsersGroupModal
        :isOpened="isOpenedGroupModal"
        :group-modal-title="groupModalTitle"
        :opened-group="openedGroup"
        v-model="usersGroups"
        @close-modal="closeGroupModal"
      />
    </div>

    <NotificationModal
      :is-opened="isOpenedNotification"
      :type="notificationOptions.type"
      :time-expired="5000"
      @close-modal="handleCloseNotification"
    >
      {{ notificationOptions.message }}
    </NotificationModal>
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
