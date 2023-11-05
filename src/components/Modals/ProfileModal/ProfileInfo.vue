<script lang="ts" setup>
import { ref } from 'vue'
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

const props = defineProps<ProfileInfoProps>()

// const users = defineModel<User[]>({
//   required: true,
// })

const isOpenedChangeEmail = ref(false)

const isOpenedChangeInfo = ref(false)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const { errors, setValues, handleSubmit } = useForm<User>({
  validationSchema: {
    firstName: (value: string) =>
      Validation.checkName(value) || 'Неверно введено имя',
    lastName: (value: string) =>
      Validation.checkName(value) || 'Неверно введена фамилия',
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

const handleEditUser = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await ManageUsersService.updateUserInfo(values, token)
    isOpenedChangeInfo.value = false

    if (response instanceof Error) {
      return // notification
    }

    // const currentUserIndex = users.value.findIndex((user) => user.id === response.id)
    // if (currentUserIndex !== -1) {
    //   users.value.splice(currentUserIndex, 1, response)
    // }

    // notification
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
        class-name="border bg-light "
        @click="handleOpenChangeInfo"
        >Изменить</Button
      >
    </div>

    <div class="content p-2">
      <div class="d-grid">
        <Typography class-name=" text-secondary">Имя</Typography>
        <Typography class-name="fs-5 ms-1">{{ props.firstName }}</Typography>
      </div>
      <div class="d-grid">
        <Typography class-name=" text-secondary">Фамилия</Typography>
        <Typography class-name="fs-5 ms-1">{{ props.lastName }}</Typography>
      </div>
      <div class="d-grid w-100">
        <Typography class-name=" text-secondary">Почта</Typography>
        <div class="w-100 d-flex justify-content-between">
          <Typography class-name="fs-5 ms-1">{{ props.email }}</Typography>
          <Button
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
      <Button
        class-name="border bg-primary text-light "
        @click="handleEditUser"
        >Сохнарить</Button
      >
    </div>

    <div class="content p-2">
      <div class="d-grid w-100">
        <Typography class-name=" text-secondary">Имя</Typography>
        <Input
          name="firstName"
          class-name="rounded-end w-100"
          :model-value="props.firstName"
          placeholder="Введите ваше имя"
          validate-on-update
        >
        </Input>
      </div>
      <div class="d-grid w-100">
        <Typography class-name=" text-secondary">Фамилия</Typography>
        <Input
          name="lastName"
          class-name="rounded-end"
          :model-value="props.lastName"
          placeholder="Введите вашу фамилию"
          validate-on-update
        >
        </Input>
      </div>
      <div class="d-grid w-100">
        <Typography class-name=" text-secondary">Почта</Typography>
        <div class="w-100 d-flex justify-content-between">
          <Typography class-name="fs-5 ms-1">{{ props.email }}</Typography>
          <Button
            class-name="border bg-mutend"
            @click="handleOpenChangeEmail"
            >Изменить почту</Button
          >
        </div>
      </div>
      <div class="d-grid">
        <Typography class-name=" text-secondary">Главная роль</Typography>
        <Typography class-name="fs-5 ms-1">{{
          getCurrentRoleRus(props.role)
        }}</Typography>
      </div>
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
