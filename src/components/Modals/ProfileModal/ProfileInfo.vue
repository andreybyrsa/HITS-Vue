<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { useDateFormat, watchImmediate } from '@vueuse/core'

import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import NewEmailRequestModal from '@Components/Modals/NewEmailRequestModal/NewEmailRequestModal.vue'

import { User } from '@Domain/User'
import Profile from '@Domain/Profile'

import ManageUsersService from '@Services/ManageUsersService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import Validation from '@Utils/Validation'

const profile = defineModel<Profile>({ required: true })

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const isOwnProfile = computed(() => profile.value.email === user.value?.email)
const isUpdatingUserInfo = ref(false)
const isOpenedChangeEmailModal = ref(false)

const { setValues, handleSubmit } = useForm<User>({
  validationSchema: {
    firstName: (value: string) =>
      Validation.checkName(value) || 'Неверно введено имя',
    lastName: (value: string) =>
      Validation.checkName(value) || 'Неверно введена фамилия',
  },
})

watchImmediate(profile, () => setUserValues())

const handleEditUser = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await ManageUsersService.updateUserInfo(values, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const { firstName, lastName } = values

    userStore.setUser({ ...currentUser, firstName, lastName })
    profile.value.firstName = firstName
    profile.value.lastName = lastName

    toogleUpdatingUserInfo(false)
  }
})

function setUserValues() {
  if (profile.value.email === user.value?.email) {
    setValues({ ...user.value })
  } else {
    const { email, firstName, lastName } = profile.value
    setValues({ email, firstName, lastName })
  }
}

function toogleUpdatingUserInfo(value: boolean) {
  isUpdatingUserInfo.value = value

  if (!value) {
    setUserValues()
  }
}

function openChangeEmailModal() {
  isOpenedChangeEmailModal.value = true
}

function handleCloseChangeEmailModal() {
  isOpenedChangeEmailModal.value = false
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}
</script>

<template>
  <div class="w-100 bg-white border p-3 rounded-3">
    <div class="header border-bottom pb-1">
      <Typography class-name="fs-4 text-primary">Информация</Typography>
      <div class="d-flex justify-content-end gap-2">
        <Button
          v-if="isOwnProfile && !isUpdatingUserInfo"
          variant="light"
          @click="toogleUpdatingUserInfo(true)"
        >
          Изменить
        </Button>
        <Button
          v-if="isUpdatingUserInfo"
          variant="primary"
          @click="handleEditUser"
        >
          Сохранить
        </Button>
        <Button
          v-if="isUpdatingUserInfo"
          variant="danger"
          @click="toogleUpdatingUserInfo(false)"
        >
          Отменить
        </Button>
      </div>
    </div>

    <div class="content p-2">
      <div class="w-100 d-flex flex-column gap-2">
        <div class="d-flex gap-1">
          <Typography class-name="text-primary">Почта:</Typography>
          <div
            class="link text-secondary cursor-pointer"
            @click="openChangeEmailModal"
          >
            изменить
          </div>
        </div>

        <Input
          name="email"
          class-name="rounded-end w-100"
          :disabled="true"
        />
      </div>

      <Input
        name="firstName"
        class-name="rounded-end w-100"
        label="Имя"
        placeholder="Введите ваше имя"
        :disabled="!isUpdatingUserInfo"
        validate-on-update
      />
      <Input
        name="lastName"
        class-name="rounded-end w-100"
        label="Фамилия"
        placeholder="Введите вашу Фамилия"
        :disabled="!isUpdatingUserInfo"
        validate-on-update
      />

      <div class="d-flex gap-1">
        <Typography class-name="text-primary">Дата регистрации:</Typography>
        <Typography class-name="text-secondary">
          {{ getFormattedDate(profile.createdAt ?? '') }}
        </Typography>
      </div>
    </div>
  </div>

  <NewEmailRequestModal
    :isOpened="isOpenedChangeEmailModal"
    @close-modal="handleCloseChangeEmailModal"
  />
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content {
  width: 100%;
  @include flexible(flex-start, flex-start, column, $gap: 16px);
}

.link {
  &:hover {
    text-decoration: underline;
    text-underline-offset: 2px;
  }
}
</style>
