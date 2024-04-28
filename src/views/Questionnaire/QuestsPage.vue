<script lang="ts" setup>
import QuestTemplatesTable from '@Components/Tables/QuestTemplatesTable/QuestTemplatesTable.vue'
</script>

<template>
  <QuestTemplatesTable />

  <router-view />
</template>

<style lang="scss" scoped>
.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}
</style>
