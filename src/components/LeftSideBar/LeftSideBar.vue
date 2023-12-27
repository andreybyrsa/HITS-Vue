<script lang="ts" setup>
import { onMounted, ref, VueElement, watch } from 'vue'
import { watchImmediate, useElementHover } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import NavTab from '@Components/NavTab/NavTab.vue'
import Button from '@Components/Button/Button.vue'
import LeftSideBarTabType from '@Components/LeftSideBar/LeftSideBar.types'
import LeftSideBarTabs from '@Components/LeftSideBar/LeftsSideBarTabs'
import RoleModal from '@Components/Modals/RoleModal/RoleModal.vue'
import LeftSideBarPlaceholder from '@Components/LeftSideBar/LeftSideBarPlaceholder.vue'
import NotificationModalWindow from '@Components/Modals/NotificationModalWindow/NotificationModalWindow.vue'

import RolesTypes from '@Domain/Roles'

import useUserStore from '@Store/user/userStore'

import { getUserRolesInfo } from '@Utils/userRolesInfo'
import MarketService from '@Services/MarketService'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useMarketsStore from '@Store/markets/marketsStore'
import { Market } from '@Domain/Market'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const marketsStore = useMarketsStore()
const { markets } = storeToRefs(marketsStore)

const notificationsStore = useNotificationsStore()

const router = useRouter()

const tabs = ref(structuredClone(LeftSideBarTabs))

const isOpenedRoleModal = ref(false)
const isOpenedNotificationsModal = ref(false)

const userRoles = getUserRolesInfo()

const leftSideBarRef = ref<VueElement | null>(null)
const LeftSideBarClassName = ref<string[]>()

const isHovered = useElementHover(leftSideBarRef, {
  delayEnter: 400,
})

watch(
  markets,
  () => {
    const currentMarkets = markets.value.filter(({ status }) => status === 'ACTIVE')
    const index = tabs.value.findIndex(({ name }) => name === 'markets')
    if (index !== -1) updateActiveMarketRoute(currentMarkets, index)
  },
  { deep: true },
)

onMounted(getActiveMarkets)

function updateActiveMarketRoute(activeMarkets: Market[], index: number) {
  const initialMarketRoutes: LeftSideBarTabType[] =
    LeftSideBarTabs[index].routes ?? []
  const marketRoutes: LeftSideBarTabType[] = activeMarkets.map(({ id, name }) => ({
    name: `market-${id}`,
    text: name,
    roles: ['INITIATOR', 'MEMBER', 'TEAM_OWNER', 'PROJECT_OFFICE', 'ADMIN'],
    iconName: 'bi bi-basket3',
    to: `/market/${id}`,
  }))
  tabs.value[index].routes = [...initialMarketRoutes, ...marketRoutes]
}

async function getActiveMarkets() {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token, role } = currentUser
    const index = tabs.value.findIndex(({ name }) => name === 'markets')

    const response = await MarketService.getAllActiveMarkets(token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    if (role?.length === 0 && response.length === 0 && index !== -1) {
      tabs.value.splice(index, 1)
    } else if (index !== -1) {
      updateActiveMarketRoute(response, index)
    }
  }
}

watchImmediate(isHovered, (value, prevValue) => {
  const opendAnimationClass = value ? 'left-side-bar--opened' : ''
  const closeAnimationClass = prevValue ? 'left-side-bar--closed' : ''

  LeftSideBarClassName.value = [
    'left-side-bar p-3 h-100',
    opendAnimationClass,
    closeAnimationClass,
  ]
})

function checkUserRole(tab: LeftSideBarTabType) {
  const currentRole = user.value?.role
  return currentRole && tab.roles.includes(currentRole)
}

function handleLogout() {
  userStore.logoutUser()
  router.push('/login')
}

function getTranslatedRole(currentRole: RolesTypes) {
  return userRoles.translatedRoles[currentRole]
}

function handleOpenRoleModal() {
  isOpenedRoleModal.value = true
}

function handleCloseRoleModal() {
  isOpenedRoleModal.value = false
}

function handleOpenNotificationModal() {
  isOpenedNotificationsModal.value = true
}

function handleCloseNotificationModal() {
  isOpenedNotificationsModal.value = false
}
</script>

<template>
  <div
    v-if="user?.role"
    ref="leftSideBarRef"
    :class="LeftSideBarClassName"
  >
    <ul class="left-side-bar__content nav nav-pills w-100 gap-2">
      <template
        v-for="(tab, index) in tabs"
        :key="index"
      >
        <NavTab
          v-if="checkUserRole(tab)"
          :wrapper-class-name="isHovered ? 'left-side-bar__link w-100' : ''"
          :class-name="isHovered ? 'text-white' : ''"
          :icon-name="tab.iconName"
          :label="isHovered ? tab.text : ''"
          :to="tab.to"
          :routes="tab.routes"
        />
      </template>
    </ul>

    <div class="d-flex flex-column gap-2">
      <Button
        class-name="left-side-bar__button btn-light w-100 text-success"
        prepend-icon-name="bi bi-circle-fill fs-6"
        @click="handleOpenRoleModal"
        :disabled="user?.roles.length === 1"
      >
        {{ isHovered ? getTranslatedRole(user.role) : '' }}
      </Button>

      <Button
        variant="light"
        class-name="left-side-bar__button"
        @click="handleOpenNotificationModal"
        prepend-icon-name="bi bi-bell"
      >
        {{ isHovered ? 'Уведомления' : '' }}
      </Button>

      <Button
        class-name="left-side-bar__button btn-light w-100"
        @click="handleLogout"
        prepend-icon-name="bi bi-box-arrow-left"
      >
        {{ isHovered ? 'Выйти' : '' }}
      </Button>
    </div>

    <RoleModal
      :is-opened="isOpenedRoleModal"
      @close-modal="handleCloseRoleModal"
    />

    <NotificationModalWindow
      :is-opened="isOpenedNotificationsModal"
      @close-modal="handleCloseNotificationModal"
    />
  </div>

  <LeftSideBarPlaceholder v-else />
</template>

<style lang="scss" scoped>
.left-side-bar {
  @include position(relative, $z-index: 8);

  overflow-x: hidden;

  @include flexible(stretch, space-between, column, $gap: 8px);

  &__content {
    @include fixedWidth(280px);

    @include flexible(flex-start, flex-start, column, $gap: 8px);
  }

  &__link {
    border-radius: 6px;

    transition: background-color $default-transition-settings;

    &:hover {
      background-color: #0000006c;
    }
  }

  &__button {
    @include fixedHeight(40px);
  }

  &--opened {
    color: $white-color;

    animation: openLeftSideBar 0.15s ease-out forwards;
  }

  &--closed {
    animation: closeLeftSideBar 0.15s ease-out forwards;
  }
}

@keyframes openLeftSideBar {
  from {
    width: 80px;
    background-color: transparent;
  }
  to {
    width: 312px;
    background-color: #000000ba;
  }
}

@keyframes closeLeftSideBar {
  from {
    width: 312px;
    background-color: #00000080;
  }
  to {
    width: 80px;
    background-color: transparent;
  }
}
</style>
