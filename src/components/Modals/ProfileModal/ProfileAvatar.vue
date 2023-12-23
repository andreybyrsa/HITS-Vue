<script lang="ts" setup>
import { Ref, ref, computed, VueElement } from 'vue'
import { storeToRefs } from 'pinia'

import Icon from '@Components/Icon/Icon.vue'
import LoadingWrapper from '@Components/LoadingWrapper/LoadingWrapper.vue'

import HTMLTargetEvent from '@Domain/HTMLTargetEvent'

import useUserStore from '@Store/user/userStore'
import useProfileStore from '@Store/profile/profileStore'

import { getUserRolesInfo } from '@Utils/userRolesInfo'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const profileStore = useProfileStore()
const { profile, avatar } = storeToRefs(profileStore)

const userRoles = getUserRolesInfo()

const fileInputRef: Ref<VueElement | null> = ref(null)

const isOwnProfile = computed(() => profile.value?.email === user.value?.email)
const isLoadingAvatar = ref(false)

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

    isLoadingAvatar.value = true
    await profileStore.uploadAvatar(file, formData, token)
    isLoadingAvatar.value = false
  }
}
</script>

<template>
  <div class="profile-avatar bg-white border p-3 rounded-3 d-flex flex-column gap-3">
    <input
      ref="fileInputRef"
      type="file"
      hidden
      @input="(event) => handleFileUpload(event as HTMLTargetEvent)"
      enctype="multipart/form-data"
    />

    <div class="d-flex justify-content-center w-100">
      <button
        class="position-relative p-0 border-radius-circle"
        @click="openFileInput"
      >
        <img
          v-if="avatar"
          class="border rounded-circle object-fit-contain"
          :src="avatar"
          width="150"
          height="150"
        />
        <Icon
          v-else
          class-name="profile-avatar__placeholder-icon bi bi-person-circle"
        />

        <LoadingWrapper
          class-name="rounded-circle"
          :is-loading="isLoadingAvatar"
        />
      </button>
    </div>

    <div class="w-100 d-flex flex-wrap justify-content-center gap-1">
      <div
        class="w-auto"
        v-for="role in profile?.roles"
        :key="role"
      >
        <div
          class="text-center rounded-pill px-2 py-1 bg-primary text-light"
          v-if="isOwnProfile && role === user?.role"
        >
          {{ userRoles.translatedRoles[role] }}
        </div>

        <div
          class="text-center border rounded-pill p-2 px-2 py-1 bg-light"
          v-else
        >
          {{ userRoles.translatedRoles[role] }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-avatar {
  width: 33%;
  height: fit-content;

  &__placeholder-icon {
    font-size: 150px;
  }
}
</style>
