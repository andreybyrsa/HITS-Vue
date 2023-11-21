<script lang="ts" setup>
import { Ref, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { ProfileInfoProps } from '@Components/Modals/ProfileModal/ProfileModal.types'
import Icon from '@Components/Icon/Icon.vue'
import Button from '@Components/Button/Button.vue'

import ProfileService from '@Services/ProfileService'

import useUserStore from '@Store/user/userStore'

import getRoles from '@Utils/getRoles'

const props = defineProps<ProfileInfoProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const userRoles = getRoles()

const isOwnProfile = computed(() => props.profile.email === user.value?.email)

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
  // const input = event.target as HTMLInputElement
  // selectedFile.value = input.files[0]
  // const formData = new FormData()
  // formData.append('file', selectedFile.value)
  // const currentUser = user.value
  // if (currentUser?.token) {
  //   const { token } = currentUser
  //   await ProfileService.uploadProfileAvatar(formData, token)
  // }
  // if (selectedFile.value) {
  //   imageUrl.value = URL.createObjectURL(selectedFile.value)
  // }
}
</script>

<template>
  <div class="user bg-white border p-3 rounded-4">
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
        class-name="avatar-button p-0"
      >
        <Icon class-name="bi bi-person-circle" />
      </Button>
    </div>
    <div class="user__roles w-100 flex-wrap">
      <div
        class="w-auto"
        v-for="role in props.profile.roles"
        :key="role"
      >
        <div
          class="text-center border rounded-pill p-2 bg-primary text-light"
          v-if="isOwnProfile && role === user?.role"
        >
          {{ userRoles.translatedRoles[role] }}
        </div>

        <div
          class="text-center border rounded-pill p-2 bg-light"
          v-else
        >
          {{ userRoles.translatedRoles[role] }}
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
  font-size: 150px;
  border-radius: 50%;
}
</style>
