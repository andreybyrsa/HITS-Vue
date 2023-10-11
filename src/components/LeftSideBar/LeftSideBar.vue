<script lang="ts" setup>
import { ref, VueElement } from 'vue'
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

import getRoles from '@Utils/getRoles'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()
const isOpenedModal = ref(false)

const userRoles = getRoles()

const leftSideBarRef = ref<VueElement | null>(null)
const LeftSideBarClassName = ref<string[]>()

const isHovered = useElementHover(leftSideBarRef, {
  delayEnter: 400,
})

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
  userStore.removeUser()
  router.push('/login')
}

function getTranslatedRole(currentRole: RolesTypes) {
  return userRoles.translatedRoles[currentRole]
}

function handleOpenModal() {
  isOpenedModal.value = true
}

function handleCloseModal() {
  isOpenedModal.value = false
}

const isOpenedNotificationModal = ref(false)

function handleOpenNotificationModal() {
  isOpenedNotificationModal.value = true
}

function handleCloseNotificationModal() {
  isOpenedNotificationModal.value = false
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
        v-for="tab in LeftSideBarTabs"
        :key="tab.id"
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
        class-name="left-side-bar__role-button btn-light w-100 text-success"
        prepend-icon-name="bi bi-circle-fill fs-6"
        @click="handleOpenModal"
        :disabled="user?.roles.length === 1"
      >
        {{ isHovered ? getTranslatedRole(user.role) : '' }}
      </Button>

      <Button
        class-name="left-side-bar__logout-button btn-light w-100"
        @click="handleLogout"
        prepend-icon-name="bi bi-box-arrow-left"
      >
        {{ isHovered ? 'Выйти' : '' }}
      </Button>

      <Button
        class-name="left-side-bar__notifications-button btn-light w-100"
        @click="handleOpenNotificationModal"
        prepend-icon-name="bi bi-bell"
      >
        {{ isHovered ? 'Уведомления' : '' }}
      </Button>
    </div>

    <RoleModal
      :is-opened="isOpenedModal"
      @close-modal="handleCloseModal"
    />

    <NotificationModalWindow
      :is-opened="isOpenedNotificationModal"
      @close-modal="handleCloseNotificationModal"
    />
  </div>

  <LeftSideBarPlaceholder v-else />
</template>

<style lang="scss" scoped>
.left-side-bar {
  @include position(relative, $z-index: 5);

  overflow-x: hidden;
  overflow-y: scroll;

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

  &__logout-button,
  &__role-button {
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
