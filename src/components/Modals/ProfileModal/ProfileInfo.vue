<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { useRoute } from 'vue-router'
import { useDateFormat, watchImmediate } from '@vueuse/core'

import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import NewEmailRequestModal from '@Components/Modals/NewEmailRequestModal/NewEmailRequestModal.vue'

import { User } from '@Domain/User'

import useUserStore from '@Store/user/userStore'
import useProfilesStore from '@Store/profiles/profilesStore'

import Validation from '@Utils/Validation'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()
const profileId = route.params.id.toString()

const profilesStore = useProfilesStore()
const profile = computed(() => profilesStore.getProfileByUserId(profileId))

const isOwnProfile = computed(() => profile.value?.email === user.value?.email)
const isUpdatingUserName = ref(false)
const isUpdatingUserLastname = ref(false)
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

    await profilesStore.updateUserFullName(values, token)
    isUpdatingUserName.value = false
    isUpdatingUserLastname.value = false
  }
})

function setUserValues() {
  if (profile.value?.email === user.value?.email) {
    setValues({ ...user.value })
  } else if (profile.value) {
    const { email, firstName, lastName } = profile.value
    setValues({ email, firstName, lastName })
  }
}

function toogleUpdateUserName(value: boolean) {
  isUpdatingUserName.value = value
  if (!value) {
    setUserValues()
  }
}

function toogleUpdateUserLastname(value: boolean) {
  isUpdatingUserLastname.value = value
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
      <Typography class-name="fs-5 text-primary">Информация</Typography>
      <div class="d-flex justify-content-end gap-2">
        <Button
          v-if="isUpdatingUserName || isUpdatingUserLastname"
          variant="success"
          @click="handleEditUser"
        >
          Сохранить
        </Button>
        <Button
          v-if="isUpdatingUserName"
          variant="danger"
          @click="toogleUpdateUserName(false)"
        >
          Отменить
        </Button>
        <Button
          v-if="isUpdatingUserLastname"
          variant="danger"
          @click="toogleUpdateUserLastname(false)"
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
            v-if="isOwnProfile"
            class="link text-secondary cursor-pointer"
            @click="openChangeEmailModal"
          >
            изменить
          </div>
        </div>

        <Input
          name="email"
          class-name="rounded-end w-100"
          disabled
        />
      </div>

      <div class="w-100 d-flex flex-column gap-2">
        <div class="d-flex gap-1">
          <Typography class-name="text-primary">Имя:</Typography>
          <div
            v-if="isOwnProfile && !isUpdatingUserName && !isUpdatingUserLastname"
            class="link text-secondary cursor-pointer"
            @click="toogleUpdateUserName(true)"
          >
            изменить
          </div>
        </div>

        <Input
          name="firstName"
          class-name="rounded-end w-100"
          placeholder="Введите ваше имя"
          :disabled="!isUpdatingUserName"
          validate-on-update
        />
      </div>

      <div class="w-100 d-flex flex-column gap-2">
        <div class="d-flex gap-1">
          <Typography class-name="text-primary">Фамилия:</Typography>
          <div
            v-if="isOwnProfile && !isUpdatingUserLastname && !isUpdatingUserName"
            class="link text-secondary cursor-pointer"
            @click="toogleUpdateUserLastname(true)"
          >
            изменить
          </div>
        </div>

        <Input
          name="lastName"
          class-name="rounded-end w-100"
          placeholder="Введите вашу фамилия"
          :disabled="!isUpdatingUserLastname"
          validate-on-update
        />
      </div>

      <div class="d-flex gap-1">
        <Typography class-name="text-primary">Дата регистрации:</Typography>
        <Typography class-name="text-secondary">
          {{ getFormattedDate(profile?.createdAt ?? '') }}
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
  height: 42px;
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
