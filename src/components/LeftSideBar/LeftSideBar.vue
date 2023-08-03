<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import logo from '@Assets/images/index'

import NavTab from '@Components/NavTab/NavTab.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'

import getRoles from '@Utils/getRoles'

import useUserStore from '@Store/user/userStore'

import NavTabsType from '@Components/LeftSideBar/LeftSideBar.types'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const navTabs: NavTabsType[] = [
  {
    id: 0,
    text: 'Список идей',
    to: '/dev',
    iconName: 'bi bi-list',
    roles: getRoles(),
  },
  {
    id: 1,
    text: 'Добавить идею',
    to: '/add-idea',
    iconName: 'bi bi-plus-lg',
    roles: ['INITIATOR', 'ADMIN'],
  },
  {
    id: 2,
    text: 'Журнал изменений',
    to: '/history',
    iconName: 'bi bi-book',
    roles: getRoles(),
  },
  {
    id: 3,
    text: 'Админ панель',
    to: '/admin',
    routes: [
      { id: 1, to: '/admin/add-users', text: 'Добавить пользователей' },
      { id: 2, to: '/admin/edit-users', text: 'Редактировать пользователей' },
    ],
    iconName: 'bi bi-sliders',
    roles: ['ADMIN'],
  },
  {
    id: 4,
    text: 'Отчеты',
    to: '/notes',
    iconName: 'bi bi-file-earmark',
    roles: ['EXPERT', 'ADMIN'],
  },
]

function checkUserRole(tab: NavTabsType) {
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
          v-for="tab in navTabs"
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

      <div class="lefts-side-bar__footer">
        <Typography class-name="text-secondary">
          Высшая школа цифровых технологий 2023 <br />
          Все права защищены
        </Typography>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.left-side-bar {
  @include flexible(flex-start, stretch, column, $gap: 16px);

  &__header {
    @include flexible(center, center, $gap: 4px);
  }

  &__content {
    @include flexible(flex-start, space-between, column);
  }
}
</style>
