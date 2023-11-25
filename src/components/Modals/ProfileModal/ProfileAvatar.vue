<script lang="ts" setup>
import { Ref, ref, computed, VueElement } from 'vue'
import { storeToRefs } from 'pinia'

import { ProfileInfoProps } from '@Components/Modals/ProfileModal/ProfileModal.types'
import Icon from '@Components/Icon/Icon.vue'
import Button from '@Components/Button/Button.vue'

import HTMLTargetEvent from '@Domain/HTMLTargetEvent'

import ProfileService from '@Services/ProfileService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import getRoles from '@Utils/getRoles'

const props = defineProps<ProfileInfoProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const userRoles = getRoles()

const isOwnProfile = computed(() => props.profile.email === user.value?.email)

const fileInputRef: Ref<VueElement | null> = ref(null)

function openFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

async function handleFileUpload(event: HTMLTargetEvent) {
  const currentUser = user.value
  const file = event.target.files?.[0]

  if (currentUser?.token && file) {
    const { token } = currentUser

    const formData = new FormData()
    formData.append('file', file)

    const response = await ProfileService.uploadProfileAvatar(formData, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }
  }
}
</script>

<template>
  <div class="user bg-white border p-3 rounded-3">
    <input
      ref="fileInputRef"
      type="file"
      hidden
      @input="(event) => handleFileUpload(event as HTMLTargetEvent)"
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
