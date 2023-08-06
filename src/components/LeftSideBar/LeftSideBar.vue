<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { logo } from '@Assets/images/index'

import NavTab from '@Components/NavTab/NavTab.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import LeftSideBarTabType from '@Components/LeftSideBar/LeftSideBar.types'
import LeftSideBarTabs from '@Components/LeftSideBar/LeftsSideBarTabs'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

function checkUserRole(tab: LeftSideBarTabType) {
  const currentRole = user.value?.role
  return currentRole && tab.roles.includes(currentRole)
}

function handleLogout() {
  userStore.removeUser()
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
