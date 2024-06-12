<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import useUserStore from '@Store/user/userStore'
import LaunchQuestsPage from '@Views/Questionnaire/LaunchQuestsPage.vue'
import QuestsPage from '@Views/Questionnaire/QuestsPage.vue'

type QuestPages = 'LaunchQuest' | 'Quest'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const computedRole = computed(() => {
  const role = user.value?.role
  return role
})

const currentPage = ref<QuestPages>('LaunchQuest')

const switchPage = (pageName: QuestPages): void => {
  currentPage.value = pageName
}

const getNavLinkStyle = (page: QuestPages) => {
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
        <li
          :class="getNavLinkStyle('LaunchQuest')"
          @click="switchPage('LaunchQuest')"
        >
          Запущенные опросы
        </li>
        <li
          v-if="computedRole == 'PROJECT_OFFICE'"
          :class="getNavLinkStyle('Quest')"
          @click="switchPage('Quest')"
        >
          Шаблоны опросов
        </li>
      </ul>
    </div>

    <LaunchQuestsPage v-if="currentPage == 'LaunchQuest'" />
    <QuestsPage v-if="currentPage == 'Quest'" />
  </div>
</template>

<style lang="scss" scoped></style>
