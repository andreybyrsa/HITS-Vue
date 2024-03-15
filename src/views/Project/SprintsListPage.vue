<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import SprintsTable from '@Components/Tables/SprintsTable/SprintsTable.vue'

import useSprintsStore from '@Store/sprints/sprintsStore'
import { SprintListProps } from '@Views/Project/Project.types'

defineProps<SprintListProps>()

const sprintsStore = useSprintsStore()
const { sprints } = storeToRefs(sprintsStore)
</script>

<template>
  <div class="overflow-y-scroll">
    <SprintsTable
      :sprints="sprints"
      :project="project"
    />
  </div>
</template>
