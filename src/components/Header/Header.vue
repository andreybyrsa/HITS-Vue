<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, RouteRecordRaw } from 'vue-router'

import Typography from '@Components/Typography/Typography.vue'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'
import RoleModal from '@Components/Modals/RoleModal/RoleModal.vue'
import Button from '@Components/Button/Button.vue'
import NotificationModalWindow from '@Components/Modals/NotificationModalWindow/NotificationModalWindow.vue'

import useUserStore from '@Store/user/userStore'
import useProfilesStore from '@Store/profiles/profilesStore'

import { getUserRolesInfo } from '@Utils/userRolesInfo'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { profile } from '@Assets/images'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()
const { getUnreadedNotifications } = storeToRefs(notificationsStore)

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

function openTelegramAdmin() {
  const link = 'tg://resolve?domain=EKATERINA270119882024'
  window.location.href = link
}

const isOpenedNotificationsModal = ref(false)
function handleOpenNotificationModal() {
  isOpenedNotificationsModal.value = true
}
function handleCloseNotificationModal() {
  isOpenedNotificationsModal.value = false
}
</script>

<template>
  <div class="py-2 px-3 bg-white header w-100">
    <div class="user-info d-flex gap-2 align-items-center">
      <div class="user-info__image rounded-circle overflow-hidden">
        <img
          v-if="avatar"
          class="border rounded-circle object-fit-contain cursor-pointer"
          :src="avatar"
          width="58"
          height="58"
          @click="navigateToProfile"
        />
        <img
          v-else
          class="text-secondary"
          :src="profile"
          width="58"
          height="58"
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

    <div class="d-flex gap-2">
      <Button
        @click="openTelegramAdmin"
        variant="primary"
        append-icon-name="bi bi-telegram"
      />
      <Button
        class-name="position-relative"
        variant="primary"
        append-icon-name="bi bi-bell-fill"
        @click="handleOpenNotificationModal"
      >
        <span
          v-if="getUnreadedNotifications.length"
          class="position-absolute top-0 start-100 px-2 translate-middle badge rounded-pill bg-danger"
        >
          {{ getUnreadedNotifications.length }}
        </span>
      </Button>
    </div>
  </div>

  <RoleModal
    :is-opened="isOpenedRoleModal"
    @close-modal="closeRoleModal"
  />
  <NotificationModalWindow
    :is-opened="isOpenedNotificationsModal"
    @close-modal="handleCloseNotificationModal"
  />
</template>

<style lang="scss">
.header {
  @include flexible(center, space-between);
}

.user-info {
  &__image {
    @include fixedHeight(58px);
    @include fixedWidth(58px);

    &-icon {
      font-size: 58px;
    }
  }

  &__name {
    width: fit-content;

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
