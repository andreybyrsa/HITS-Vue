<script lang="ts" setup>
import RolesTypes from '@Domain/Roles'
import { useRoute, useRouter } from 'vue-router'

import Typography from '@Components/Typography/Typography.vue'

import { ProfileInfoProps } from '@Components/Modals/ProfileModal/ProfileModal.types'
import { useDateFormat } from '@vueuse/core'
import { Ref, ref, onMounted } from 'vue'
import ProfileService from '@Services/ProfileService'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import Button from '@Components/Button/Button.vue'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const props = defineProps<ProfileInfoProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const router = useRouter()
const route = useRoute()

const userAvatar = ref<FormData>()

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

function getFormattedDate(date: Date) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'HH:MM DD.MM.YYYY')
    return formattedDate.value
  }
}

const fileInputRef: Ref<HTMLInputElement | null> = ref(null)
const imageUrl: Ref<string | null> = ref(null)
const selectedFile = ref<File | null>(null)

const openFileInput = (): void => {
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
    fileInputRef.value.click()
  }
}

const handleFileChange = async (event: Event): Promise<void> => {
  const input = event.target as HTMLInputElement
  selectedFile.value = input.files[0]

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    await ProfileService.uploadProfileAvatar(formData, token)
  }

  if (selectedFile.value) {
    imageUrl.value = URL.createObjectURL(selectedFile.value)
  }
}

// const handleFileChange = handleSubmit(async (event: Event) => {
//   const file = (event.target as HTMLInputElement).files?.[0]
//   if (file) {
//     imageUrl.value = URL.createObjectURL(file)

//     if (user.value?.token) {
//       const { token } = user.value
//       await ProfileService.uploadProfileAvatar(file, token)
//     }
//   }
// })

// onMounted(async () => {
//   const currentUser = user.value

//   if (currentUser?.token) {
//     const { token } = currentUser
//     const email = route.params.email.toString()
//     const response = await ProfileService.getProfileAvatar(email, token)

//     if (response instanceof Error) {
//       return notificationsStore.createSystemNotification('Система', 'Ошибка')
//     }

//     userAvatar.value = response
//   }
// })
</script>

<template>
  <div class="user bg-white border p-3 rounded-4">
    <!--  <div class="user__head mb-2">
   <Typography class-name="text-secondary">НЕ В СЕТИ</Typography>
      <Typography class-name="text-secondary"
        >Был в сети {{ getFormattedDate(props.user.) }}</Typography
      >
    </div>  -->
    <input
      ref="fileInputRef"
      type="file"
      style="display: none"
      @input="handleFileChange"
      enctype="multipart/form-data"
    />
    <div class="d-flex justify-content-center w-100 mb-2">
      <Button
        @click="openFileInput"
        class="avatar-button p-0"
      >
        <img
          id="imgAva"
          :src="imageUrl"
          alt="Avatar"
          class="avatar border"
        />
      </Button>
    </div>
    <div class="user__roles w-100 flex-wrap">
      <div
        class="w-auto"
        v-for="role in props.user.roles"
        :key="role"
      >
        <div
          class="text-center border rounded-pill p-2 bg-primary text-light"
          v-if="role === props.user.role"
        >
          {{ getCurrentRoleRus(role) }}
        </div>

        <div
          class="text-center border rounded-pill p-2 bg-light"
          v-else
        >
          {{ getCurrentRoleRus(role) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user {
  width: 33%;
  height: fit-content;
  display: block;

  &__head {
    @include flexible(flex-end, center, column);
  }
  &__roles {
    @include flexible(center, center, $gap: 8px);
  }
}
.avatar {
  border-radius: 50%;
  width: 250px;
  height: 250px;
}

.avatar-button {
  border-radius: 50%;
}
</style>
