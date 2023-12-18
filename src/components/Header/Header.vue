<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouteRecordRaw } from 'vue-router'

import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'
import Icon from '@Components/Icon/Icon.vue'

import ProfileService from '@Services/ProfileService'

import useUserStore from '@Store/user/userStore'

import { getUserRolesInfo } from '@Utils/userRolesInfo'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const userRolesInfo = getUserRolesInfo()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { email, token } = currentUser

    const response = await ProfileService.getProfileAvatar(email, token)

    if (typeof response === 'string') {
      console.log(response)
    }
  }
})

function navigateToProfile() {
  const currentUser = user.value
  const profileRoute: RouteRecordRaw = {
    name: 'profile',
    path: 'profil/:id',
    alias: '/profile/:id',
    component: ProfileModal,
  }

  if (currentUser) {
    const { id } = currentUser
    navigateToAliasRoute(`/profile/${id}`, profileRoute)
  }
}
</script>

<template>
  <div class="px-3 py-1 bg-white d-flex">
    <div
      class="user-info p-2 rounded-3 d-flex gap-2 align-items-center cursor-pointer"
      @click="navigateToProfile"
    >
      <div class="user-info__image rounded-circle overflow-hidden">
        <LoadingPlaceholder height="small" />
      </div>

      <div class="d-flex flex-column">
        <div class="d-flex gap-1 fw-semibold">
          <Typography>{{ user?.firstName }}</Typography>
          <Typography>{{ user?.lastName }}</Typography>
        </div>

        <div class="d-flex gap-1 text-success">
          <Icon class-name="bi bi-circle-fill opacity-75" />
          <Typography v-if="user?.role">
            {{ userRolesInfo.translatedRoles[user?.role] }}
          </Typography>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-info {
  &:hover {
    background-color: rgba($color: $secondary-color, $alpha: 0.3);

    transition: background-color ease-out;
  }

  &__image {
    @include fixedHeight(50px);
    @include fixedWidth(50px);
  }
}
</style>
