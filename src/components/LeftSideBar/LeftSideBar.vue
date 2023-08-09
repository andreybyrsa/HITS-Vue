<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { logo } from '@Assets/images/index'

import NavTab from '@Components/NavTab/NavTab.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import LeftSideBarTabType from '@Components/LeftSideBar/LeftSideBar.types'
import LeftSideBarTabs from '@Components/LeftSideBar/LeftsSideBarTabs'
import RoleModal from '@Components/Modals/RoleModal/RoleModal.vue'

import useUserStore from '@Store/user/userStore'
import getRoles from '@Utils/getRoles'
import RolesTypes from '@Domain/Roles'
import { ref } from 'vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()
const isOpenedModal = ref(false)

let isActiveModal = ref(true)

if (user.value?.roles.length == 1) {
  isActiveModal = ref(false)
} else {
  isActiveModal = ref(true)
}

function checkUserRole(tab: LeftSideBarTabType) {
  const currentRole = user.value?.role
  return currentRole && tab.roles.includes(currentRole)
}

function handleLogout() {
  userStore.removeUser()
  router.push('/login')
}

const userRoles = getRoles()

const getTranslatedRole = (currentRole: RolesTypes) => {
  return userRoles.translatedRoles[currentRole]
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
        class-name="btn-light w-100 fs-6 text-success"
        icon-name="bi bi-circle-fill"
        @click="isOpenedModal = true"
      >
        <Typography class-name="fs-5 text-succes">{{
          getTranslatedRole(user?.role) || 'Выберите роль'
        }}</Typography>
      </Button>
    </div>

    <RoleModal
      v-if="isActiveModal"
      :is-opened="isOpenedModal"
      @close-modal="isOpenedModal = false"
    />
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
