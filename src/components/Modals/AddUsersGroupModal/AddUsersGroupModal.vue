<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm, useFieldArray } from 'vee-validate'

import {
  AddUsersGroupModalProps,
  AddUsersGroupModalEmits,
} from '@Components/Modals/AddUsersGroupModal/AddUsersGroupModal.types'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import GroupTypesFilterModal from '@Components/Modals/GroupTypesFilterModal/GroupTypesFilterModal.vue'

import useNotification from '@Hooks/useNotification'

import useUserStore from '@Store/user/userStore'

import { User } from '@Domain/User'
import UserGroup from '@Domain/Group'
import RolesTypes from '@Domain/Roles'

import GroupService from '@Services/GroupsService'
import ManageUsersService from '@Services/ManageUsersService'

const props = defineProps<AddUsersGroupModalProps>()
const emit = defineEmits<AddUsersGroupModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const users = ref<User[]>([])

const unselectedUsers = ref<User[]>([])

const editGroup = ref<UserGroup>()

const selectedFilters = ref<RolesTypes[]>([])
const isOpenedFilterModal = ref(false)

const groups = defineModel<UserGroup[]>({
  required: true,
})

const groupTypeOptions = [
  { value: 'INITIATOR', label: 'Группа пользователей' },
  { value: 'PROJECT_OFFICE', label: 'Группа проектого офиса' },
  { value: 'EXPERT', label: 'Группа экспертов' },
  { value: 'ADMIN', label: 'Группа админов' },
]

const { handleOpenNotification } = useNotification()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const responseUsers = await ManageUsersService.getUsers(token)

    if (responseUsers instanceof Error) {
      return handleOpenNotification('error', responseUsers.message)
    }

    users.value = responseUsers
  }
})

const { setValues, handleSubmit } = useForm<UserGroup>({
  validationSchema: {
    name: (value: string) => value?.length > 0 || 'Поле не заполнено',
    users: (value: User[]) => value?.length > 0 || 'Выберите пользователя',
    role: (value: string) => value?.length > 0 || 'Выберите тип группы',
  },
})

const { fields, push, remove } = useFieldArray<User>('users')

watch(
  () => props.openedGroup,
  (openedGroup) => {
    if (openedGroup) {
      const { name, users: groupUsers, role } = openedGroup
      setValues({ name, users: groupUsers, role })

      editGroup.value = openedGroup
      unselectedUsers.value = users.value.filter((user) =>
        openedGroup.users.every((groupUser) => groupUser.email !== user.email),
      )
    }
  },
)

function selectUser(user: User, index: number) {
  push(user)
  unselectedUsers.value.splice(index, 1)
}

function unselectUser(user: User, index: number) {
  remove(index)
  unselectedUsers.value.push(user)
}

function handleOpenFilterModal() {
  isOpenedFilterModal.value = true
}

function handleCloseFilterModal() {
  isOpenedFilterModal.value = false
}

function handleSetFilters(filters: RolesTypes[]) {
  selectedFilters.value = filters
}

function usersRolesFilter(usersData: User[]) {
  if (selectedFilters.value.length) {
    const dataFilter: User[] = []
    usersData?.forEach((elem) => {
      const hasSelectedRole = selectedFilters.value.some((filter) =>
        elem.roles?.includes(filter),
      )
      if (hasSelectedRole) {
        dataFilter.push(elem)
      }
    })
    return dataFilter
  }
  return usersData
}

const handleCreate = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await GroupService.createUsersGroup(values, token)

    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }

    emit('close-modal')
    groups.value.push(response)
  }
})

const handleEdit = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token && editGroup.value) {
    const { token } = currentUser
    const { id } = editGroup.value
    const response = await GroupService.editUsersGroup(values, token, id)

    if (response instanceof Error) {
      return handleOpenNotification('error', response.message)
    }

    emit('close-modal')
    const editingGroupIndex = groups.value.findIndex(
      (group) => group.id === values.id,
    )
    groups.value.splice(editingGroupIndex, 1, values)
  }
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="add-Users-group-modal p-3 bg-white rounded-3">
      <div class="add-Users-group-modal__header">
        <Typography class-name="fs-2 text-primary">{{ groupModalTitle }}</Typography>
        <Button
          class-name="btn-close"
          @click="emit('close-modal')"
        ></Button>
      </div>
      <Input
        name="name"
        class-name="fs-6 h-50 rounded-end"
        label="Название группы"
        placeholder="Введите название группы"
      />

      <div class="d-flex justify-content-between">
        <div class="selectors">
          <Typography class-name="fs-6 text-primary">
            Пользователи не в группе
          </Typography>
          <div class="select-block border">
            <div
              class="unselected-selected-usesrs shadow-sm rounded border"
              v-for="(user, index) in usersRolesFilter(unselectedUsers) ||
              unselectedUsers"
              :key="index"
              @click="selectUser(user, index)"
            >
              <Typography class-name="m-2 fs-6">
                {{ user.lastName }} {{ user.firstName }}
              </Typography>
            </div>
          </div>
        </div>

        <div class="move-buttons m-2 pt-4">
          <Button
            prepend-icon-name="bi bi-funnel-fill text-light"
            class-name="shadow-sm bg-primary min-vh-10 mb-4"
            @click="handleOpenFilterModal"
          ></Button>
          <GroupTypesFilterModal
            :is-opened="isOpenedFilterModal"
            @close-modal="handleCloseFilterModal"
            @set-filters="handleSetFilters"
            :current-filters="[...selectedFilters]"
          />
        </div>

        <div class="selectors">
          <Typography class-name="fs-6 text-primary"
            >Пользователи в группе</Typography
          >
          <div class="select-block border">
            <div
              class="unselected-selected-usesrs shadow-sm rounded border"
              v-for="(user, index) in fields"
              :key="index"
              @click="unselectUser(user.value, index)"
            >
              <Typography class-name="m-2 fs-6">
                {{ user.value.lastName }} {{ user.value.firstName }}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Select
          name="role"
          validate-on-update
          :options="groupTypeOptions"
          label="Тип группы"
          placeholder="Выберите тип группы"
          prepend
        ></Select>
      </div>
      <div v-if="groupModalTitle === 'Добавить группу'">
        <Button
          class-name="btn-primary w-100"
          @click="handleCreate"
        >
          Добавить
        </Button>
      </div>
      <Button
        v-else
        class-name="btn-primary"
        @click="handleEdit"
      >
        Редактировать
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.add-Users-group-modal {
  width: 600px;

  @include flexible(
    stretch,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  &__header {
    @include flexible(center, space-between);
  }

  transition: all $default-transition-settings;
}

.modal-layout-enter-from .filter-modal,
.modal-layout-leave-to .filter-modal {
  transform: scale(0.9);
}

.list-group {
  max-height: 400px;
  overflow-y: scroll;
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

.list-group-item {
  display: flex;
  width: 100%;
}

.choose-user {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.selectors {
  width: 48%;
}

.select-block {
  border-radius: 12px;
  height: 250px;
  overflow-y: hidden;
}

.unselected-selected-usesrs {
  cursor: pointer;
  margin: 8px;
}

.unselected-selected-usesrs:hover {
  background-color: rgb(240, 240, 240);
}

.move-buttons {
  @include flexible(flex-start, center, columns);
}
</style>
