<script lang="ts" setup>
import useLaunchQuestStore from '@Store/launchQuests/launchQuestsStore'
import { storeToRefs } from 'pinia'

const launchQuestStore = useLaunchQuestStore()
const { launchQuests } = storeToRefs(launchQuestStore)
</script>

<template>{{ launchQuests[1] }}</template>
