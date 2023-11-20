<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import RolesTypes from '@Domain/Roles'

import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'

import { ProfileInfoProps } from '@Components/Modals/ProfileModal/ProfileModal.types'
import Input from '@Components/Inputs/Input/Input.vue'
import ChangeEmailView from '@Views/ChangeEmailView.vue'

import Validation from '@Utils/Validation'
import { User } from '@Domain/User'
import useUserStore from '@Store/user/userStore'
import ManageUsersService from '@Services/ManageUsersService'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const props = defineProps<ProfileInfoProps>()

const notificationsStore = useNotificationsStore()

const isOpenedChangeEmail = ref(false)

const isOpenedChangeInfo = ref(false)

const actualUser = ref<User>(props.user)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const { setValues, handleSubmit } = useForm<User>({
  validationSchema: {
    firstName: (value: string) =>
      Validation.checkName(value) || 'Неверно введено имя',
    lastName: (value: string) =>
      Validation.checkName(value) || 'Неверно введена фамилия',
    //roles: (value: RolesTypes[]) => Validation.checkIsEmptyValue(value),
  },
})

function getCurrentRoleRus(role: RolesTypes) {
  if (role === 'ADMIN') {
    return 'Админ '
  }
  if (role === 'INITIATOR') {
    return 'Инициатор '
  }
  if (role === 'PROJECT_OFFICE') {
    return 'Проектный офис '
  }
  if (role === 'EXPERT') {
    return 'Эксперт '
  }
}

function handleOpenChangeInfo() {
  isOpenedChangeInfo.value = true
}

function handleCloseChangeInfo() {
  isOpenedChangeInfo.value = false
}

function handleOpenChangeEmail() {
  isOpenedChangeEmail.value = true
}

function handleCloseChangeEmail() {
  isOpenedChangeEmail.value = false
}

watch(
  () => props.user,
  () => {
    if (props.user) {
      setValues({ ...props.user })
    }
  },
)

const handleEditUser = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    values.roles = currentUser.roles
    values.id = currentUser.id
    values.email = currentUser.email
    const response = await ManageUsersService.updateUserInfo(values, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    isOpenedChangeInfo.value = false
    actualUser.value = values

    return notificationsStore.createSystemNotification(
      'Система',
      'Данные успешно изменены',
    )
  }
})
</script>

<template>
  <div
    class="w-100 bg-white border p-3 rounded-4"
    v-if="isOpenedChangeInfo == false"
  >
    <div class="header border-bottom pb-1">
      <Typography class-name="fs-4 text-primary">Информация</Typography>
      <Button
        v-if="props.status == true"
        class-name="border bg-light "
        @click="handleOpenChangeInfo"
        >Изменить</Button
      >
    </div>

    <div class="content p-2">
      <div class="d-grid">
        <Typography class-name=" text-secondary">Имя</Typography>
        <Typography class-name="fs-5 ms-1">{{ actualUser.firstName }}</Typography>
      </div>
      <div class="d-grid">
        <Typography class-name=" text-secondary">Фамилия</Typography>
        <Typography class-name="fs-5 ms-1">{{ actualUser.lastName }}</Typography>
      </div>
      <div class="d-grid w-100">
        <Typography class-name=" text-secondary">Почта</Typography>
        <div class="w-100 d-flex justify-content-between">
          <Typography class-name="fs-5 ms-1">{{ actualUser.email }}</Typography>
          <Button
            v-if="props.status == true"
            class-name="border bg-mutend"
            @click="handleOpenChangeEmail"
            >Изменить почту</Button
          >
        </div>
      </div>
      <!-- <div class="d-grid">
        <Typography class-name=" text-secondary">Главная роль</Typography>
        <Typography class-name="fs-5 ms-1">{{
          getCurrentRoleRus(props.role)
        }}</Typography>
      </div> -->
    </div>
  </div>

  <div
    class="w-100 bg-white border p-3 rounded-4"
    v-if="isOpenedChangeInfo == true"
  >
    <div class="header border-bottom pb-1">
      <Typography class-name="fs-4 text-primary">Информация</Typography>
      <div class="d-flex">
        <Button
          class-name="border bg-primary text-light "
          @click="handleEditUser"
          >Сохнарить</Button
        >
        <Button
          class-name="border bg-danger text-light "
          @click="handleCloseChangeInfo"
          >Отменить</Button
        >
      </div>
    </div>

    <div class="content p-2">
      <div class="d-grid w-100">
        <Typography class-name=" text-secondary">Имя</Typography>
        <Input
          key="1"
          name="firstName"
          class-name="rounded-end w-100"
          :model-value="props.user.firstName"
          placeholder="Введите ваше имя"
          validate-on-update
        >
        </Input>
      </div>
      <div class="d-grid w-100">
        <Typography class-name=" text-secondary">Фамилия</Typography>
        <Input
          key="2"
          name="lastName"
          class-name="rounded-end"
          :model-value="props.user.lastName"
          placeholder="Введите вашу фамилию"
          validate-on-update
        >
        </Input>
      </div>
      <div class="d-grid w-100">
        <Typography class-name=" text-secondary">Почта</Typography>
        <div class="w-100 d-flex justify-content-between">
          <Typography class-name="fs-5 ms-1">{{ props.user.email }}</Typography>
          <Button
            v-if="props.status == true"
            class-name="border bg-mutend"
            @click="handleOpenChangeEmail"
            >Изменить почту</Button
          >
        </div>
      </div>

      <!-- <div class="d-grid">
        <Typography class-name=" text-secondary">Главная роль</Typography>
        <Typography class-name="fs-5 ms-1">{{
          getCurrentRoleRus(props.role)
        }}</Typography>
      </div> -->
    </div>
  </div>
  <ChangeEmailView
    :isOpened="isOpenedChangeEmail"
    @close-modal="handleCloseChangeEmail"
  >
  </ChangeEmailView>
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
</style>
