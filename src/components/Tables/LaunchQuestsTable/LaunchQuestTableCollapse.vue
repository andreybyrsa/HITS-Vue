<script lang="ts" setup>
import { defineProps } from 'vue'
import { TableCollapse } from '@Components/Tables/LaunchQuestsTable/LaunchQuestTableCollapse.types'

defineProps<TableCollapse>()
</script>

<template>
  <div>{{ data }}</div>
</template>
