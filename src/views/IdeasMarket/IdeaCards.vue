<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import IdeasMarket from '@Domain/IdeasMarket'
import useUserStore from '@Store/user/userStore'
import IdeasMarketService from '@Services/IdeasMarketService'
import SingleIdeaCard from './SingleIdeaCard.vue'
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const ideas = ref<IdeasMarket[] | null>(null)
const isAllIdeas = ref(true)

onMounted(getIdeas)

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
  <div
    v-if="ideas"
    class="ideas-container"
  >
    <SingleIdeaCard
      v-for="idea in ideas"
      :key="idea.id"
      :idea="idea"
      :is-all-ideas="isAllIdeas"
      v-model="ideas"
    />
  </div>
</template>
<style lang="scss">
.header-link {
  cursor: pointer;
}
</style>
