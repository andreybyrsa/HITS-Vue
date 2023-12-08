<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
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

const searchedIdeas = computed(() => {
  if (!searchedValue.value) {
    return ideas.value
  }

  const lowercaseSearch = searchedValue.value.toLowerCase().trim()
  return ideas.value?.filter((idea) => {
    const ideaName = idea.name.toLocaleLowerCase().trim()
    return ideaName.includes(lowercaseSearch)
  })
})

onMounted(async () => getIdeasByRole())

watch(
  () => user.value?.role,
  async () => {
    if (isAllIdeas.value) getIdeasByRole()
  },
)

async function getIdeasByRole() {
  const currentUser = user.value

  if (currentUser?.token && currentUser.role) {
    const { token, role } = currentUser

    ideas.value = null
    const response = await ideasMarketStore.getMarketIdeas(role, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    ideas.value = response
  }
}

async function getFavoritesIdeas() {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser

    ideas.value = null
    const response = await IdeasMarketService.fetchFavoritesIdeas(token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    ideas.value = response
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

async function switchNavTab(value: boolean, callback: () => Promise<void>) {
  await callback()
  isAllIdeas.value = value
}
</script>

<template>
  <PageLayout content-class-name="market-page__content p-3 bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <Typography class-name="fs-2 text-primary w-75">Биржа идей</Typography>

      <div class="nav nav-underline">
        <div
          :class="getNavTabClass(isAllIdeas === true)"
          @click="switchNavTab(true, getIdeasByRole)"
        >
          Все
        </div>
        <div
          :class="getNavTabClass(isAllIdeas === false)"
          @click="switchNavTab(false, getFavoritesIdeas)"
        >
          Избранное
        </div>
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

      <div v-if="searchedIdeas">
        <SingleIdeaCard
          v-for="idea in searchedIdeas"
          :key="idea.id"
          :idea="idea"
          :is-all-ideas="isAllIdeas"
          v-model:ideas="searchedIdeas"
        />
      </div>

      <router-view />
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
  &__content {
    overflow-y: scroll;

    @include flexible(stretch, flex-start, column);
  }
}
</style>
