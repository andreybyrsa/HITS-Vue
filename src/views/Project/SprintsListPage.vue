<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import SprintsTable from '@Components/Tables/SprintsTable/SprintsTable.vue'

import useSprintsStore from '@Store/sprints/sprintsStore'
import { SprintListProps } from '@Views/Project/Project.types'

defineProps<SprintListProps>()

const sprintsStore = useSprintsStore()
const { sprints } = storeToRefs(sprintsStore)
</script>

<template>
  <div
    class="w-100 mt-4"
    class-name="sprints-page__content"
  >
    <SprintsTable
      :sprint="sprints"
      :project-id="projectId"
      :tasks="tasks"
    />
  </div>
</template>

<style lang="scss" scoped>
.sprints-page {
  &__content {
    overflow-y: scroll;

    @include flexible(stretch, flex-start, column);
  }
}
</style>
