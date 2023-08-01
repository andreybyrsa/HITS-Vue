<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import useIdeasStore from '@Store/ideas/ideasStore'
import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const ideasStore = useIdeasStore()

const { user } = storeToRefs(userStore)
const { ideas } = storeToRefs(ideasStore)
</script>

<template>
  <pre v-if="user">Пользователь - {{ user }}</pre>
  <pre v-if="ideas.length">{{ ideas }}</pre>
</template>
