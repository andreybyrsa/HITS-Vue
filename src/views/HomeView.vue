<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'
import useIdeasStore from '@Store/ideas/ideasStore'

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
  <Button
    :class-name="'btn btn-primary'"
    :icon-name="'bi bi-arrow-counterclockwise'"
  >
    Initiator
  </Button>

  <pre v-if="user">
    Текущий пользователь - {{ user }}
  </pre>

  <pre v-if="ideas.length">
    Идеи - {{ ideas }}
  </pre>
</template>
