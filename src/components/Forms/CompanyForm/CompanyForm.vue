<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import CompanyVue from '@Components/Forms/CompanyForm/Company.vue'
import Button from '@Components/Button/Button.vue'
import CompanyFormProps from '@Components/Forms/CompanyForm/CompanyForm.types'

import { User } from '@Domain/User'
import Company from '@Domain/Company'

import CompanyService from '@Services/CompanyService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import Validation from '@Utils/Validation'

const props = defineProps<CompanyFormProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const router = useRouter()

const { handleSubmit } = useForm<Company>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    owner: (value: User) => Validation.checkIsEmptyValue(value) || 'Поле не выбрано',
    members: (value: User[]) =>
      Validation.checkIsEmptyValue(value) || 'Участники не выбраны',
  },
  initialValues: {
    ...props.company,
  },
})

const handleCreateCompany = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await CompanyService.createCompany(values, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    router.push({ name: 'companies-list' })
  }
})

const handleUpdateCompany = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token && props.company) {
    const { token } = currentUser
    const { id } = props.company
    const response = await CompanyService.updateCompany(values, id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    router.push({ name: 'companies-list' })
  }
})
</script>

<template>
  <div class="company-form bg-white p-3">
    <div class="company-form__content w-75 h-100">
      <Typography class-name="fs-2 text-primary">
        {{ props.company ? 'Редактирование компании' : 'Создание компании' }}
      </Typography>

      <Input
        name="name"
        class-name="rounded-end"
        label="Название компании*"
        validate-on-update
        placeholder="Введите название компании"
      />

      <CompanyVue />

      <Button
        v-if="props.company"
        class-name="btn-primary px-4"
        @click="handleUpdateCompany"
      >
        Сохранить изменения
      </Button>
      <Button
        v-else
        class-name="btn-primary px-4"
        @click="handleCreateCompany"
      >
        Создать компанию
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.company-form {
  @include flexible(flex-start, center);

  &__content {
    @include flexible(center, flex-start, column, $gap: 16px);
  }
}
</style>
