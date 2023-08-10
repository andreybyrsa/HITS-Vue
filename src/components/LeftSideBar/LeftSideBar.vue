<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { logo } from '@Assets/images/index'

import NavTab from '@Components/NavTab/NavTab.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import LeftSideBarTabType from '@Components/LeftSideBar/LeftSideBar.types'
import LeftSideBarTabs from '@Components/LeftSideBar/LeftsSideBarTabs'
import RoleModal from '@Components/Modals/RoleModal/RoleModal.vue'

import RolesTypes from '@Domain/Roles'

import useUserStore from '@Store/user/userStore'

import getRoles from '@Utils/getRoles'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()
const isOpenedModal = ref(false)

const userRoles = getRoles()

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
</script>

<template>
  <div class="left-side-bar p-3 w-100 h-100">
    <div class="left-side-bar__header w-100">
      <img
        :src="logo"
        alt="logo"
      />
      <Typography class-name="fs-2 text-primary">HITS Ideas</Typography>
    </div>

    <div class="left-side-bar__content h-100 w-100">
      <ul class="nav nav-pills w-100 gap-2">
        <template
          v-for="tab in LeftSideBarTabs"
          :key="tab.id"
        >
          <NavTab
            v-if="checkUserRole(tab)"
            :icon-name="tab.iconName"
            :to="tab.to"
            :routes="tab.routes"
          >
            {{ tab.text }}
          </NavTab>
        </template>

        <Button
          class-name="btn-light w-100"
          @click="handleLogout"
        >
          Выйти
        </Button>
      </ul>

      <Button
        class-name="btn-light w-100 text-success"
        icon-name="bi bi-circle-fill fs-6"
        @click="handleOpenModal"
        :disabled="user?.roles.length === 1"
      >
        {{ user?.role ? getTranslatedRole(user.role) : 'Выберите роль' }}
      </Button>

      <RoleModal
        :is-opened="isOpenedModal"
        @close-modal="handleCloseModal"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.left-side-bar {
  background-color: $white-color;

  @include flexible(flex-start, stretch, column, $gap: 16px);

  &__header {
    @include flexible(center, center, $gap: 4px);
  }

  &__content {
    @include flexible(flex-start, space-between, column);
  }
}
</style>
