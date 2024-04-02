<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { watchImmediate } from '@vueuse/core'
import useUserStore from '@Store/user/userStore'
import { getRouteByUserRole } from '@Utils/userRolesInfo'
import LaunchQuestsPage from '@Views/Quest/LaunchQuestsPage.vue'
import QuestsPage from '@Views/Quest/QuestsPage.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

type QuestPages = 'LaunchQuest' | 'Quest'

const currentPage = ref<QuestPages>('LaunchQuest')

const switchPage = (pageName: QuestPages): void => {
  currentPage.value = pageName
}

function getNavLinkStyle(page: QuestPages) {
  return [
    'nav-link',
    'fw-normal',
    'pb-1',
    'cursor-pointer',
    { 'active text-primary': page == currentPage.value },
    { 'text-secondary': page != currentPage.value },
  ]
}
</script>

<template>
  <div class="content">
    <div class="border-bottom px-3">
      <ul class="nav nav-underline">
        <div
          :class="getNavLinkStyle('LaunchQuest')"
          @click="switchPage('LaunchQuest')"
        >
          Запущенные опросы
        </div>
        <div
          :class="getNavLinkStyle('Quest')"
          @click="switchPage('Quest')"
        >
          Шаблоны опросов
        </div>
      </ul>
    </div>

    <LaunchQuestsPage v-if="currentPage == 'LaunchQuest'" />
    <QuestsPage v-if="currentPage == 'Quest'" />
  </div>
</template>

<style lang="scss" scoped></style>
