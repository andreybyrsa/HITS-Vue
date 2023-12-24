<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, RouteRecordRaw } from 'vue-router'

import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'
import RoleModal from '@Components/Modals/RoleModal/RoleModal.vue'
import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'
import useProfilesStore from '@Store/profiles/profilesStore'

import { getUserRolesInfo } from '@Utils/userRolesInfo'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const profilesStore = useProfilesStore()
const avatar = computed(() =>
  profilesStore.getProfileAvatarByUserId(user.value?.id ?? ''),
)

const userRolesInfo = getUserRolesInfo()

const route = useRoute()

const isOpenedRoleModal = ref(false)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { id, token } = currentUser

    await profilesStore.fetchProfileAvatar(id, token)
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
    props: {
      canGoBack: true,
    },
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
        <img
          v-if="avatar"
          class="border rounded-circle object-fit-contain"
          :src="avatar"
          width="58"
          height="58"
        />
        <LoadingPlaceholder
          v-else
          class-name="user-info__image-placeholder"
        />
      </div>

      <div class="d-flex gap-1 flex-column">
        <div
          class="user-info__name fw-semibold cursor-pointer"
          @click="navigateToProfile"
        >
          <Typography>{{ user?.firstName }} {{ user?.lastName }}</Typography>
        </div>

        <Button
          class-name="user-info__role btn-sm rounded-4 py-1"
          variant="outline-success"
          prepend-icon-name="bi bi-circle-fill fs-6"
          :disabled="user?.roles.length === 1"
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

  &__role {
    width: fit-content;
  }
}
</style>
