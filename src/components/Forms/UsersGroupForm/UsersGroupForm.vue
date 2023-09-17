<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  AddUsersGroupModalProps,
  AddUsersGroupModalEmits,
} from '@Components/Modals/AddUsersGroupModal/AddUsersGroupModal.types'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import AddUsersGroup from '@Components/Modals/AddUsersGroupModal/AddUsersGroupModal.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import useNotification from '@Hooks/useNotification'

import useUserStore from '@Store/user/userStore'

import { UserGroup } from '@Domain/Group'

import { User } from '@Domain/User'

import GroupService from '@Services/GroupsService'

import { useForm, useFieldArray } from 'vee-validate'

import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'

const emit = defineEmits<AddUsersGroupModalEmits>()

const searchedValue = ref('')

const currentOpenedDeleteIdea = ref('')

const isOpenedIdeaDeleteModal = ref(false)

const isOpenedGroupModal = ref(false)

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const editGroup = ref<UserGroup>()

const groups = ref<UserGroup[]>([])
const editingGroup = ref<UserGroup>()

const groupModalTitle = ref()

const {
  notificationOptions,
  isOpenedNotification,
  handleOpenNotification,
  handleCloseNotification,
} = useNotification()

const { setValues, handleSubmit, values } = useForm<UserGroup>({
  validationSchema: {
    name: (value: string) => value?.length > 0 || 'Поле не заполнено',
    users: (value: User[]) => value?.length > 0 || 'Выберите пользователя',
  },
})

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
  return groups.value.filter((users) => {
    const groupName = users.name?.toLowerCase().trim()
    const currentSearchedValue = searchedValue.value?.toLowerCase().trim()

    const isIncludesSearcheValue =
      groupName && groupName.includes(currentSearchedValue)

    return isIncludesSearcheValue
  })
})

function closeGroupModal() {
  isOpenedGroupModal.value = false
}

function openGroupModal(id?: string) {
  if (id) {
    const currentSelectedGroup = groups.value.find((group) => group.id == id)
    if (currentSelectedGroup) {
      editingGroup.value = {
        ...currentSelectedGroup,
      }
      groupModalTitle.value = 'Редактировать группу'
    }
  } else {
    editingGroup.value = null
    groupModalTitle.value = 'Добавить группу'
  }
  isOpenedGroupModal.value = true
}

function saveGroup(newGroup: UserGroup) {
  groups.value.push(newGroup)
}

function deleteGroup(id: string) {
  isOpenedIdeaDeleteModal.value = true
  currentOpenedDeleteIdea.value = id
  // groups.value = groups.value.filter((group) => group.id !== id)
}

function editCurrentGroup(userGroup: UserGroup) {
  const groupIndex = groups.value.findIndex((group) => group.id === userGroup.id)
  groups.value.splice(groupIndex, 1, userGroup)
}

const handleDelete = async () => {
  isOpenedIdeaDeleteModal.value = true
  const currentUser = user.value
  if (currentUser?.token && editGroup.value) {
    const { token } = currentUser
    const { id } = editGroup.value
    const response = await GroupService.deleteUsersGroup(values, token, id)
    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }
    handleOpenNotification('success', response.success)
    emit('close-modal')
    emit('delete-group', values.id)
  }
}

function handleCloseDeleteModal() {
  isOpenedIdeaDeleteModal.value = false
}
console.log(searchedGroup)
</script>

<template>
  <FormLayout class-name="users-group-form p-3 w-100 h-100 bg-white">
    <Typography class-name="fs-3 text-primary text-center w-100"
      >Группы пользователей</Typography
    >
    <div class="w-50">
      <Input
        name="search"
        v-model="searchedValue"
        placeholder="Поиск группы пользователей"
      >
        <template #append>
          <Button
            class-name="px-2 py-0"
            @click="() => openGroupModal()"
            prepend-icon-name="bi bi-plus-lg"
            >Добавить группу
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
          <Typography class-name="fs-6 ">{{ group.groupType }}</Typography>
        </div>

        <Button
          class-name="users-group-form__edit-btn "
          prepend-icon-name="bi bi-pencil-square text-primary"
          @click="openGroupModal(group.id)"
        ></Button>
        <Button
          @click="deleteGroup(group.id)"
          prepend-icon-name="bi bi-trash-fill text-danger"
        ></Button>
      </div>
      <DeleteModal
        :is-opened="isOpenedIdeaDeleteModal"
        @close-modal="handleCloseDeleteModal"
        @delete="handleDelete"
      />
      <AddUsersGroup
        :isOpened="isOpenedGroupModal"
        :editing-group="editingGroup"
        @close-modal="closeGroupModal"
        @save-group="saveGroup"
        @delete-group="deleteGroup"
        @edit-group="editCurrentGroup"
        :group-modal-title="groupModalTitle"
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
