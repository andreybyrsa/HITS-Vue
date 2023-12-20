<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouteRecordRaw } from 'vue-router'

import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'
import RoleModal from '@Components/Modals/RoleModal/RoleModal.vue'
import Button from '@Components/Button/Button.vue'

import ProfileService from '@Services/ProfileService'

import useUserStore from '@Store/user/userStore'

import { getUserRolesInfo } from '@Utils/userRolesInfo'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const userRolesInfo = getUserRolesInfo()

const route = useRoute()

const isOpenedRoleModal = ref(false)

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
  const { name } = route
  const profileRoute: RouteRecordRaw = {
    name: 'profile',
    path: 'profil/:id',
    alias: '/profile/:id',
    component: ProfileModal,
  }

  if (currentUser && name) {
    const { id } = currentUser
    navigateToAliasRoute(name.toString(), `/profile/${id}`, profileRoute)
  }
}

function openRoleModal() {
  isOpenedRoleModal.value = true
}

function closeRoleModal() {
  isOpenedRoleModal.value = false
}
</script>

<template>
  <div class="p-3 bg-white d-flex">
    <div class="user-info d-flex gap-2 align-items-center">
      <div class="user-info__image rounded-circle overflow-hidden">
        <LoadingPlaceholder class-name="user-info__image-placeholder" />
      </div>

      <div class="d-flex gap-1 flex-column">
        <div
          class="user-info__name fw-semibold cursor-pointer"
          @click="navigateToProfile"
        >
          <Typography>{{ user?.firstName }} {{ user?.lastName }}</Typography>
        </div>

        <Button
          class-name="btn-sm rounded-4 py-1"
          variant="outline-success"
          prepend-icon-name="bi bi-circle-fill fs-6"
          @click="openRoleModal"
        >
          <template v-if="user?.role">
            {{ userRolesInfo.translatedRoles[user?.role] }}
          </template>
        </Button>
      </div>
    </div>
  </div>

  <RoleModal
    :is-opened="isOpenedRoleModal"
    @close-modal="closeRoleModal"
  />
</template>

<style lang="scss">
.user-info {
  &__image {
    @include fixedHeight(58px);
    @include fixedWidth(58px);

    &-placeholder {
      @include fixedHeight(58px);
    }
  }

  &__name {
    &:hover {
      text-decoration: underline;
      text-underline-offset: 5px;
    }
  }
}
</style>
