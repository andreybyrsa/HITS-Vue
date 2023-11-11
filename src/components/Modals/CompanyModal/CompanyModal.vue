<script lang="ts" setup>
import { ref, onMounted, onUpdated } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm, useFieldArray } from 'vee-validate'

import {
  CompanyModalProps,
  CompanyModalEmits,
} from '@Components/Modals/CompanyModal/CompanyModal.types'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import UsersColumns from '@Components/Modals/CompanyModal/UsersColumns.vue'
import CompanyModalPlaceholder from '@Components/Modals/CompanyModal/CompanyModalPlaceholder.vue'

import { User } from '@Domain/User'
import Company from '@Domain/Company'

import CompanyService from '@Services/CompanyService'
import ManageUsersService from '@Services/ManageUsersService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import Validation from '@Utils/Validation'

const notificationsStore = useNotificationsStore()

const props = defineProps<CompanyModalProps>()
const emit = defineEmits<CompanyModalEmits>()

const companies = defineModel<Company[]>({
  required: true,
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const users = ref<User[]>([])
const unselectedUsers = ref<User[]>([])

const isLoadingCompany = ref(true)

const companyModalMode = ref<'CREATE' | 'UPDATE'>('CREATE')

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const responseUsers = await ManageUsersService.getUsers(token)

    if (responseUsers instanceof Error) {
      return notificationsStore.createSystemNotification(
        'Система',
        responseUsers.message,
      )
    }

    users.value = responseUsers
  }
})

const { setValues, handleSubmit } = useForm<Company>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    owner: (value: User) =>
      Validation.checkIsEmptyValue(value) || 'Выберите владельца компании',
    users: (value: User[]) =>
      Validation.checkIsEmptyValue(value) || 'Выберите пользователей',
  },
  initialValues: {
    users: [],
  },
})

const { fields, push, remove } = useFieldArray<User>('users')

onUpdated(async () => {
  if (props.companyId !== undefined && props.isOpened) {
    const currentUser = user.value

    if (currentUser?.token) {
      const { token } = currentUser
      const { companyId } = props

      isLoadingCompany.value = true
      const response = await CompanyService.getCompany(companyId, token)

      if (response instanceof Error) {
        return notificationsStore.createSystemNotification(
          'Система',
          response.message,
        )
      }

      setValues({ ...response })
      unselectedUsers.value = users.value.filter((user) =>
        response.users.every((companyUser) => companyUser.id !== user.id),
      )
      companyModalMode.value = 'UPDATE'

      isLoadingCompany.value = false
    }
  } else if (props.isOpened) {
    setValues({ name: '', users: [] })
    unselectedUsers.value = [...users.value]
    companyModalMode.value = 'CREATE'

    isLoadingCompany.value = false
  }
})

function selectUser(user: User, index: number) {
  push(user)
  unselectedUsers.value.splice(index, 1)
}

function unselectUser(user: User, index: number) {
  remove(index)
  unselectedUsers.value.push(user)
}

const handleCreateCompany = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await CompanyService.createCompany(values, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    companies.value.push(response)

    notificationsStore.createSystemNotification('Система', 'Группа успешно создана')
    emit('close-modal')
  }
})

const handleUpdateCompany = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = values
    const response = await CompanyService.updateCompany(values, id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const editingCompanyIndex = companies.value.findIndex(
      (company) => company.id === values.id,
    )

    if (editingCompanyIndex !== -1) {
      companies.value.splice(editingCompanyIndex, 1, values)
    }

    notificationsStore.createSystemNotification('Система', 'Группа успешно изменена')

    emit('close-modal')
  }
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div
      v-if="isOpened"
      class="company-modal p-3 bg-white rounded-3"
    >
      <template v-if="isLoadingCompany">
        <CompanyModalPlaceholder />
      </template>

      <template v-else>
        <div class="company-modal__header">
          <Typography class-name="fs-2 text-primary">
            {{
              companyModalMode === 'CREATE'
                ? 'Создание компании'
                : 'Редактирование компании'
            }}
          </Typography>
          <Button
            class-name="btn-close"
            @click="emit('close-modal')"
          ></Button>
        </div>

        <Input
          name="name"
          class-name="h-50 rounded-end"
          label="Название компании:"
          validate-on-update
          placeholder="Введите название компании"
        />

        <Combobox
          name="owner"
          label="Выберите владельца компании:"
          :options="users"
          :display-by="['firstName', 'lastName']"
          placeholder="Владелец компании"
        />

        <UsersColumns
          :users="fields"
          :unselected-users="unselectedUsers"
          @select-user="selectUser"
          @unselect-user="unselectUser"
        />

        <Button
          v-if="companyModalMode === 'CREATE'"
          class-name="btn-primary w-100"
          @click="handleCreateCompany"
        >
          Добавить
        </Button>
        <Button
          v-else
          class-name="btn-primary"
          @click="handleUpdateCompany"
        >
          Сохранить изменения
        </Button>
      </template>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.company-modal {
  width: 600px;

  @include flexible(
    stretch,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }
}

.modal-layout-enter-from .company-modal,
.modal-layout-leave-to .company-modal {
  transform: scale(0.9);
}
</style>
