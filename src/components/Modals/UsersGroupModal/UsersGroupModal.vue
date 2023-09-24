<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm, useFieldArray } from 'vee-validate'

import {
  UsersGroupModalProps,
  UsersGroupModalEmits,
} from '@Components/Modals/UsersGroupModal/UsersGroupModal.types'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import GroupTypesFilterModal from '@Components/Modals/GroupTypesFilterModal/GroupTypesFilterModal.vue'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'

import useNotification from '@Hooks/useNotification'

import useUserStore from '@Store/user/userStore'

import { User } from '@Domain/User'
import UsersGroup from '@Domain/UsersGroup'
import RolesTypes from '@Domain/Roles'

import UsersGroupsService from '@Services/UsersGroupsService'
import ManageUsersService from '@Services/ManageUsersService'
import NotificationModal from '../NotificationModal/NotificationModal.vue'

const props = defineProps<UsersGroupModalProps>()
const emit = defineEmits<UsersGroupModalEmits>()

const groups = defineModel<UsersGroup[]>({
  required: true,
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const users = ref<User[]>([])

const unselectedUsers = ref<User[]>([])

const openedGroup = ref<UsersGroup>()

const selectedFilters = ref<RolesTypes[]>([])
const isOpenedFilterModal = ref(false)

const groupRoles = [
  { id: 0, name: 'Группа инициаторов', roles: 'INITIATOR' },
  { id: 1, name: 'Группа админов', roles: 'ADMIN' },
  { id: 2, name: 'Группа проектного офиса', roles: 'PROJECT_OFFICE' },
  { id: 3, name: 'Группа экспертов', roles: 'EXPERT' },
]

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
    const responseUsers = await ManageUsersService.getUsers(token)

    if (responseUsers instanceof Error) {
      return handleOpenNotification('error', 'Ошибка загрузки пользователей')
    }

    users.value = responseUsers
  }
})

const { setValues, handleSubmit } = useForm<UsersGroup>({
  validationSchema: {
    name: (value: string) => value?.length > 0 || 'Поле не заполнено',
    users: (value: User[]) => value?.length > 0 || 'Выберите пользователя',
    roles: (value: RolesTypes[]) => value?.length > 0 || 'Выберите тип группы',
  },
  initialValues: { roles: [] },
})

const { fields, push, remove } = useFieldArray<User>('users')

watch(
  () => props.openedGroup,
  (currentGroup) => {
    if (currentGroup) {
      const { name, users: groupUsers, roles } = currentGroup
      setValues({ name, users: groupUsers, roles })

      openedGroup.value = currentGroup
      unselectedUsers.value = users.value.filter((user) =>
        currentGroup.users.every((groupUser) => groupUser.email !== user.email),
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

const handleCreateGroup = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await UsersGroupsService.createUsersGroup(values, token)

    if (response instanceof Error) {
      return handleOpenNotification('error', 'Ошибка создания группы')
    }

    handleOpenNotification('success', 'Успешное создание группы')
    emit('close-modal')
    groups.value.push(response)
  }
})

const handleEditGroup = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token && openedGroup.value) {
    const { token } = currentUser
    const { id } = openedGroup.value
    const response = await UsersGroupsService.editUsersGroup(values, token, id)

    if (response instanceof Error) {
      return handleOpenNotification('error', 'Ошибка редактирования группы')
    }

    handleOpenNotification('success', 'Успешное редактирование группы')
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
          <Typography class-name="fs-6 text-primary">
            Пользователи в группе
          </Typography>
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
        <div>
          <Typography class-name="text-primary">Выберите тип группы</Typography>
        </div>
        <div class="mt-2 w-100">
          <Combobox
            name="roles"
            :options="groupRoles"
            :display-by="['name']"
            no-form-controlled
            placeholder="Выберите тип группы"
            multiselect-placeholder="Выберите тип группы"
          />
        </div>
      </div>
      <div v-if="groupModalTitle === 'Добавить группу'">
        <Button
          class-name="btn-primary w-100"
          @click="handleCreateGroup"
        >
          Добавить
        </Button>
      </div>
      <Button
        v-else
        class-name="btn-primary"
        @click="handleEditGroup"
      >
        Редактировать
      </Button>
    </div>
    <NotificationModal
      :is-opened="isOpenedNotification"
      :type="notificationOptions.type"
      :time-expired="5000"
      @close-modal="handleCloseNotification"
    >
      {{ notificationOptions.message }}
    </NotificationModal>
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

.group-categories {
  @include flexible(flex-start, stretch, $gap: 16px);

  &__technologies {
    @include flexible(center, flex-start, $flex-wrap: wrap, $gap: 4px);
  }

  &__delete-technology {
    cursor: pointer;
  }
}
</style>
