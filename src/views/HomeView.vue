<script lang="ts" setup>
import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const ideasStore = useIdeasStore()

const { user } = storeToRefs(userStore)
const { ideas } = storeToRefs(ideasStore)

function handleLogin() {
  userStore.loginUser('AndreyByrsa')
}
function handleFetchIdeas() {
  ideasStore.fetchIdeas()
}
</script>

<template>
  <div class="home">
    <button @click="handleLogin">Логин</button>
    <button @click="handleFetchIdeas">Получить идеи</button>
  </div>

  <pre v-if="user">
    Текущий пользователь - {{ user }}
  </pre>

  <pre v-if="ideas.length">
    Идеи - {{ ideas }}
  </pre>
</template>
