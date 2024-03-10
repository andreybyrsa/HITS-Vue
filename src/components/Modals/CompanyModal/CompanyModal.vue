<script lang="ts" setup>
import { ref, onMounted, onUpdated } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm, useFieldArray } from 'vee-validate'
import { User, Company } from '@Domain'
import { useUserStore, useNotificationsStore } from '@Store'
import { CompanyService, ManageUsersService } from '@Service'
import { validation } from '@Utils'
import {
  CompanyModalProps,
  CompanyModalEmits,
} from '@Components/Modals/CompanyModal/CompanyModal.types'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import UsersColumns from '@Components/UserColumns/UsersColumns.vue'
import CompanyModalPlaceholder from '@Components/Modals/CompanyModal/CompanyModalPlaceholder.vue'

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
const isCreating = ref(false)
const isUpdating = ref(false)

const companyModalMode = ref<'CREATE' | 'UPDATE'>('CREATE')

onMounted(async () => {
  const responseUsers = await ManageUsersService.getUsers()

  if (responseUsers instanceof Error) {
    return notificationsStore.createSystemNotification(
      'Система',
      responseUsers.message,
    )
  }

  users.value = responseUsers
})

const { setValues, handleSubmit } = useForm<Company>({
  validationSchema: {
    name: (value: string) =>
      validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    owner: (value: User) =>
      validation.checkIsEmptyValue(value) || 'Выберите руководителя компании',
    users: (value: User[]) =>
      validation.checkIsEmptyValue(value) || 'Выберите представителей',
  },
  initialValues: {
    users: [],
  },
})

const { fields, push, remove } = useFieldArray<User>('users')

onUpdated(async () => {
  if (props.companyId !== undefined && props.isOpened) {
    const { companyId } = props

    isLoadingCompany.value = true
    const response = await CompanyService.get(companyId)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    setValues({ ...response })
    unselectedUsers.value = users.value.filter((user) =>
      response.users.every((companyUser) => companyUser.id !== user.id),
    )
    companyModalMode.value = 'UPDATE'

    isLoadingCompany.value = false
  } else if (props.isOpened) {
    setValues({ name: '', users: [] })
    unselectedUsers.value = [...users.value]
    companyModalMode.value = 'CREATE'

    isLoadingCompany.value = false
  }
})

function selectUser(user: User) {
  const selectedUserIndex = unselectedUsers.value.findIndex(
    ({ id }) => id === user.id,
  )

  if (selectedUserIndex !== -1) {
    push(user)
    unselectedUsers.value.splice(selectedUserIndex, 1)
  }
}

function unselectUser(user: User, index: number) {
  remove(index)
  unselectedUsers.value.push(user)
}

const handleCreateCompany = handleSubmit(async (values) => {
  isCreating.value = true
  const response = await CompanyService.create(values)
  isCreating.value = false

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  companies.value.push(response)

  notificationsStore.createSystemNotification('Система', 'Компания успешно создана')
  emit('close-modal')
})

const handleUpdateCompany = handleSubmit(async (values) => {
  const { id } = values

  isUpdating.value = true
  const response = await CompanyService.update(values, id)
  isUpdating.value = false

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  const editingCompanyIndex = companies.value.findIndex(
    (company) => company.id === values.id,
  )

  if (editingCompanyIndex !== -1) {
    companies.value.splice(editingCompanyIndex, 1, values)
  }

  notificationsStore.createSystemNotification('Система', 'Компания успешно изменена')

  emit('close-modal')
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
            variant="close"
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
          label="Выберите руководителя компании:"
          :options="users"
          :display-by="['firstName', 'lastName']"
          comparing-key="id"
          placeholder="Руководитель компании"
        />

        <UsersColumns
          :users="fields"
          :unselected-users="unselectedUsers"
          unselected-users-label="Пользователи:"
          selected-users-label="Представители компании:"
          @select-user="selectUser"
          @unselect-user="unselectUser"
        />

        <Button
          v-if="companyModalMode === 'CREATE'"
          variant="primary"
          :is-loading="isCreating"
          @click="handleCreateCompany"
        >
          Добавить
        </Button>
        <Button
          v-else
          variant="primary"
          :is-loading="isUpdating"
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
