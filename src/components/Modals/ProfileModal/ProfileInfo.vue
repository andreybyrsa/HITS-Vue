<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { useRoute } from 'vue-router'
import { useDateFormat } from '@vueuse/core'

import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import NewEmailRequestModal from '@Components/Modals/NewEmailRequestModal/NewEmailRequestModal.vue'

import useProfilesStore from '@Store/profiles/profilesStore'

import Validation from '@Utils/Validation'
import { Profile } from '@Domain/Profile'
import LocalStorageTelegramTag from '@Utils/LocalStorageTelegramTag'
import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

onBeforeMount(() => {
  const tag = LocalStorageTelegramTag.get()
  setValues({ ...profile.value, userTag: tag ?? '' })
})

const route = useRoute()
const profileId = route.params.id.toString()

const profilesStore = useProfilesStore()
const profile = ref(profilesStore.getProfileByUserId(profileId))
const computedProfile = computed(() => profile.value)

const isOwnProfile = computed(() => computedProfile.value?.id === user.value?.id)
const isUpdatingUserName = ref(false)
const isUpdatingUserLastname = ref(false)
const isUpdatingUserStudyGroup = ref(false)
const isUpdatingUserTelephone = ref(false)
const isOpenedChangeEmailModal = ref(false)
const isUpdatingTelegram = ref(false)

const { setValues, handleSubmit } = useForm<Profile>({
  validationSchema: {
    firstName: (value: string) =>
      Validation.checkName(value) || 'Неверно введено имя',
    lastName: (value: string) =>
      Validation.checkName(value) || 'Неверно введена фамилия',
    // userTag: (value: string) =>
    //   Validation.checkTag(value) || 'Неверно введён тег телеграм',
  },
}) // Если поставить здесь валидацию, то в случае, когда поле userTag будет незаполнено,
// а пользователь захочет изменить другое поле, то система этого сделать не даст,
// потому что стоит валидация на пустое поле

watch(computedProfile, () => setUserValues(), { deep: true, immediate: true })

const handleEditUser = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    await profilesStore.updateUserFullName(values, token)
    isUpdatingUserTelephone.value = false
    isUpdatingUserName.value = false
    isUpdatingUserLastname.value = false
    isUpdatingUserStudyGroup.value = false
  }
})

const handleEditUserTag = handleSubmit(async (values) => {
  const currentUser = profile.value // token брать из user
  if (!currentUser?.token) return

  const userTelegram = await profilesStore.fetchUserTelegram(
    profileId,
    currentUser.token,
  ) // не понял махинацию здесь

  if (!userTelegram || userTelegram instanceof Error) return

  const { token } = currentUser

  await profilesStore.updateUserTelegramTag(values, userTelegram, token)

  isUpdatingTelegram.value = false
})

async function setUserValues() {
  if (computedProfile.value?.email === user.value?.email) {
    setValues({ ...user.value })
  } else if (profile.value) {
    const { email, firstName, lastName, studyGroup, telephone, userTag } =
      profile.value
    setValues({ email, firstName, lastName, studyGroup, telephone, userTag })
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

function toogleUpdateUserStudyGroup(value: boolean) {
  isUpdatingUserStudyGroup.value = value
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

function toogleUpdatingUserTelephone(value: boolean) {
  isUpdatingUserTelephone.value = value
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
          v-if="
            isUpdatingUserName ||
            isUpdatingUserLastname ||
            isUpdatingUserStudyGroup ||
            isUpdatingUserTelephone
          "
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
        <Button
          v-if="isUpdatingUserStudyGroup"
          variant="danger"
          @click="toogleUpdateUserStudyGroup(false)"
        >
          Отменить
        </Button>
        <Button
          v-if="isUpdatingUserTelephone"
          variant="danger"
          @click="toogleUpdatingUserTelephone(false)"
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

      <!-- <div class="w-100 d-flex flex-column gap-2">
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
      </div> -->

      <div class="w-100 d-flex flex-column gap-2">
        <div class="d-flex gap-1">
          <Typography class-name="text-primary">Имя:</Typography>
          <div
            v-if="
              isOwnProfile &&
              !isUpdatingUserLastname &&
              !isUpdatingUserName &&
              !isUpdatingUserStudyGroup &&
              !isUpdatingUserTelephone
            "
            s
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
              !isUpdatingUserStudyGroup &&
              !isUpdatingUserTelephone
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

      <div class="w-100 d-flex flex-column gap-2">
        <div class="d-flex gap-1">
          <Typography class-name="text-primary">Группа:</Typography>
          <div
            v-if="
              isOwnProfile &&
              !isUpdatingUserLastname &&
              !isUpdatingUserName &&
              !isUpdatingUserStudyGroup &&
              !isUpdatingUserTelephone
            "
            class="link text-secondary cursor-pointer"
            @click="toogleUpdateUserStudyGroup(true)"
          >
            изменить
          </div>
        </div>

        <Input
          name="studyGroup"
          class-name="rounded-end w-100"
          placeholder="Введите вашу учебную группу"
          :disabled="!isUpdatingUserStudyGroup"
          validate-on-update
        />
      </div>

      <div
        v-if="isOwnProfile"
        class="w-100 d-flex flex-column gap-2"
      >
        <div class="d-flex gap-1">
          <Typography class-name="text-primary">Телефон:</Typography>
          <div
            v-if="
              !isUpdatingUserLastname &&
              !isUpdatingUserName &&
              !isUpdatingUserStudyGroup &&
              !isUpdatingUserTelephone
            "
            class="link text-secondary cursor-pointer"
            @click="toogleUpdatingUserTelephone(true)"
          >
            изменить
          </div>
        </div>

        <Input
          name="telephone"
          class-name="rounded-end w-100"
          placeholder="+7(___)-___-__-__"
          :disabled="!isUpdatingUserTelephone"
          validate-on-update
          v-mask="'+7(###)-###-##-##'"
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
