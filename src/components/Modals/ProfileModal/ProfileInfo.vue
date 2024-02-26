<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { useRoute } from 'vue-router'
import { useDateFormat, watchImmediate } from '@vueuse/core'

import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import NewEmailRequestModal from '@Components/Modals/NewEmailRequestModal/NewEmailRequestModal.vue'

import ProfileService from '@Services/ProfileService'

import { User, UserTelegram } from '@Domain/User'

import useProfilesStore from '@Store/profiles/profilesStore'

import Validation from '@Utils/Validation'
import { Profile } from '@Domain/Profile'
import { string } from 'yup'
import { usersTelegramMocks } from '@Utils/getMocks'
import LoginForm from '@Components/Forms/LoginForm/LoginForm.vue'
import LocalStorageTelegramTag from '@Utils/LocalStorageTelegramTag'

onBeforeMount(() => {
  const tag = LocalStorageTelegramTag.get()
  if (tag === null) return
  setValues({ ...profile.value, userTag: tag ?? '' })
})

const route = useRoute()
const profileId = route.params.id.toString()

const profilesStore = useProfilesStore()
const profile = ref(profilesStore.getProfileByUserId(profileId))
const computedProfile = computed(() => profile.value)

const isOwnProfile = computed(
  () => computedProfile.value?.email === profile.value?.email,
)
const isUpdatingUserName = ref(false)
const isUpdatingUserLastname = ref(false)
const isOpenedChangeEmailModal = ref(false)
const isUpdatingTelegram = ref(false)

const { setValues, handleSubmit } = useForm<Profile>({
  validationSchema: {
    firstName: (value: string) =>
      Validation.checkName(value) || 'Неверно введено имя',
    lastName: (value: string) =>
      Validation.checkName(value) || 'Неверно введена фамилия',
    userTag: (value: string) =>
      Validation.checkTag(value) || 'Неверно введён тег телеграм',
  },
})

watch(computedProfile, () => setUserValues(), { deep: true, immediate: true })

const handleEditUser = handleSubmit(async (values) => {
  const currentUser = profile.value
  if (currentUser?.token) {
    const { token } = currentUser
    await profilesStore.updateUserFullName(values, token)
    isUpdatingUserName.value = false
    isUpdatingUserLastname.value = false
  }
})

const handleEditUserTag = handleSubmit(async (values) => {
  const currentUser = profile.value
  if (!currentUser?.token) return

  const userTelegram = await profilesStore.fetchUserTelegram(
    profileId,
    currentUser.token,
  )

  if (!userTelegram || userTelegram instanceof Error) return

  const { token } = currentUser

  await profilesStore.updateUserTelegramTag(values, userTelegram, token)

  isUpdatingTelegram.value = false
  profile.value = await profilesStore.getProfileByUserId(profileId)
  console.log(profile.value?.userTag)
})

async function setUserValues() {
  if (computedProfile.value?.email === profile.value?.email) {
    setValues({ ...profile.value })
  } else if (computedProfile.value) {
    const { email, firstName, lastName, userTag } = computedProfile.value
    setValues({ email, firstName, lastName, userTag })
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

function toogleUpdateTelegram(value: boolean) {
  isUpdatingTelegram.value = value
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
          v-if="isUpdatingUserName"
          variant="success"
          @click="handleEditUser"
        >
          Сохранить
        </Button>
        <Button
          v-if="isUpdatingUserLastname"
          variant="success"
          @click="handleEditUser"
        >
          Сохранить
        </Button>
        <Button
          v-if="isUpdatingTelegram"
          variant="success"
          @click="handleEditUserTag"
        >
          Сохранить
        </Button>
        <Button
          v-if="isUpdatingUserName || isUpdatingUserLastname || isUpdatingTelegram"
          variant="danger"
          @click="
            toogleUpdateUserName(false),
              toogleUpdateUserLastname(false),
              toogleUpdateTelegram(false)
          "
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
            v-if="
              isOwnProfile &&
              !isUpdatingUserLastname &&
              !isUpdatingUserName &&
              !isUpdatingTelegram
            "
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
          <Typography class-name="text-primary">Telegram-тег:</Typography>
          <div
            v-if="
              isOwnProfile &&
              !isUpdatingUserLastname &&
              !isUpdatingUserName &&
              !isUpdatingTelegram
            "
            class="link text-secondary cursor-pointer"
            @click="toogleUpdateTelegram(true)"
          >
            изменить
          </div>
        </div>

        <Input
          name="userTag"
          class-name="rounded-end "
          placeholder="Введите ваш Telegram-тег"
          :disabled="!isUpdatingTelegram"
          validate-on-update
          prepend="@"
        />
      </div>

      <div class="w-100 d-flex flex-column gap-2">
        <div class="d-flex gap-1">
          <Typography class-name="text-primary">Имя:</Typography>
          <div
            v-if="
              isOwnProfile &&
              !isUpdatingUserName &&
              !isUpdatingUserLastname &&
              !isUpdatingTelegram
            "
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
            v-if="
              isOwnProfile &&
              !isUpdatingUserLastname &&
              !isUpdatingUserName &&
              !isUpdatingTelegram
            "
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
          {{ getFormattedDate(computedProfile?.createdAt ?? '') }}
        </Typography>
      </div>
    </div>
  </div>
  {{ profile?.userTag }}
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
