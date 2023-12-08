<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Icon from '@Components/Icon/Icon.vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import SingleIdeaCard from '@Views/IdeasMarket/SingleIdeaCard.vue'

import IdeasMarket from '@Domain/IdeasMarket'

import IdeasMarketService from '@Services/IdeasMarketService'

import useUserStore from '@Store/user/userStore'
import useIdeasMarketStore from '@Store/ideasMarket/ideasMarket'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasMarketStore = useIdeasMarketStore()

const notificationsStore = useNotificationsStore()

const ideas = ref<IdeasMarket[] | null>(null)
const isAllIdeas = ref(true)

const searchedValue = ref('')

const filteredIdeas = computed(() => {
  if (!searchedValue.value || !ideas.value) {
    return ideas.value
  }

  const lowercaseSearch = searchedValue.value.toLowerCase()
  return ideas.value.filter((idea) =>
    idea.name.toLowerCase().includes(lowercaseSearch),
  )
})

onMounted(getIdeas)

watchImmediate(
  () => user.value?.role,
  async (currentRole) => {
    const currentUser = user.value

    if (currentUser?.token && currentRole) {
      const { token } = currentUser

      const response = await ideasMarketStore.getMarketIdeas(currentRole, token)

      if (response instanceof Error) {
        return notificationsStore.createSystemNotification(
          'Система',
          response.message,
        )
      }

      ideas.value = response
    }
  },
)

async function getIdeas() {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    ideas.value = null

    const response = await IdeasMarketService.fetchIdeasMarket(token)

    if (response instanceof Error) {
      return
    }

    ideas.value = response
    isAllIdeas.value = true
  }
}

async function getFavoritesIdeas() {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    ideas.value = null

    const response = await IdeasMarketService.fetchFavoritesIdeas(token)

    if (response instanceof Error) {
      return
    }

    ideas.value = response
    isAllIdeas.value = false
  }
}

function getNavTabClass(isAllIdeas: boolean) {
  const initialClass = ['nav-link', 'header-link']
  if (isAllIdeas) {
    initialClass.push('active', 'text-primary')
    return initialClass
  }
  initialClass.push('text-dark')
  return initialClass
}
</script>

<template>
  <PageLayout content-class-name="market-page__content p-3 bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>
    <template #content>
      <router-view />
      <Typography class-name="fs-2 text-primary w-75">Биржа идей</Typography>

      <div class="nav nav-underline">
        <div
          :class="getNavTabClass(isAllIdeas === true)"
          @click="getIdeas"
        >
          Все
        </div>
        <div
          :class="getNavTabClass(isAllIdeas === false)"
          @click="getFavoritesIdeas"
        >
          Избранное
        </div>
      </div>
      <div class="w-50 mb-3">
        <Input
          name="search"
          class-name="rounded-end"
          no-form-controlled
          v-model="searchedValue"
          placeholder="Поиск"
        >
          <template #prepend>
            <Icon class-name="bi bi-search" />
          </template>
        </Input>
      </div>
      <div
        v-if="ideas"
        class=""
      >
        <div
          v-if="filteredIdeas"
          class="idea-cards row"
        >
          <SingleIdeaCard
            v-for="idea in filteredIdeas"
            :key="idea.id"
            :idea="idea"
            :is-all-ideas="isAllIdeas"
            v-model:ideas="ideas"
          />
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<style lang="scss">
.header-link {
  cursor: pointer;
}
.nav {
  display: flex;
  justify-content: center;
  padding-bottom: 16px;
}
.market-page {
  &__header {
    @include flexible(center, space-between);
  }

  &__content {
    overflow-y: scroll;

    @include flexible(stretch, flex-start, column);
  }
}

.idea-cards {
  width: 100%;
  grid-row-gap: 20px;
}
</style>
