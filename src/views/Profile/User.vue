<script lang="ts" setup>
import RolesTypes from '@Domain/Roles'

import Typography from '@Components/Typography/Typography.vue'

import ProfileUserProps from '@Views/Profile/User.types'
import { useDateFormat } from '@vueuse/core'
import { Ref, ref } from 'vue'
import ProfileService from '@Services/ProfileService'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'

const props = defineProps<ProfileUserProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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

// const fileInputRef: Ref<HTMLInputElement | null> = ref(null)
// const imageUrl: Ref<string | null> = ref(null)
// const selectedFile = ref<File | null>(null)

// const openFileInput = (): void => {
//   if (fileInputRef.value) {
//     fileInputRef.value.value = ''
//     fileInputRef.value.click()
//   }
// }

// const handleFileChange = (event: Event): void => {
//   const formData = new FormData()
//   const file = (event.target as HTMLInputElement).files?.[0]

//   formData.append('file', file.toBlob(), file?.name)

//   const input = event.target as HTMLInputElement
//   selectedFile.value = input.files[0]
//   const formData = new FormData()
//   formData.append('file', selectedFile.value)
//   if (selectedFile.value) {
//     imageUrl.value = URL.createObjectURL(selectedFile.value)
//   }

//   if (user.value?.token) {
//     const { token } = user.value
//     ProfileService.uploadAvatar(formData, token)
//     console.log(formData)
//   }
// }

// const handleFileChange = handleSubmit(async (event: Event) => {
//   const file = (event.target as HTMLInputElement).files?.[0]
//   if (file) {
//     imageUrl.value = URL.createObjectURL(file)

//     if (user.value?.token) {
//       const { token } = user.value
//       await ProfileService.uploadAvatar(file, token)
//     }
//   }
// })
</script>

<template>
  <div class="user bg-white border p-3 rounded-4">
    <div class="user__head mb-2">
      <!-- <Typography class-name="text-secondary">НЕ В СЕТИ</Typography> -->
      <Typography class-name="text-secondary"
        >Был в сети {{ getFormattedDate(props.lastActivity) }}</Typography
      >
    </div>
    <div class="d-flex justify-content-center w-100 mb-2">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
        alt="Avatar"
        class="avatar border"
      />
    </div>
    <div class="user__roles w-100 flex-wrap">
      <div
        class="w-auto"
        v-for="role in props.roles"
        :key="role"
      >
        <div
          class="text-center border rounded-pill p-2 bg-primary text-light"
          v-if="role === props.role"
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
</style>
