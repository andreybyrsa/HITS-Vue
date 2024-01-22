<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import SprintsTable from '@Components/Tables/SprintsTable/SprintsTable.vue'

import useSprintsStore from '@Store/sprints/sprintsStore'

const sprintsStore = useSprintsStore()
const { sprints } = storeToRefs(sprintsStore)
</script>

<template>
  <div
    class="w-100"
    class-name="sprints-page__content"
  >
    <SprintsTable :sprint="sprints" />
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
