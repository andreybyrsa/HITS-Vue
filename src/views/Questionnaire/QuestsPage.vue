<script lang="ts" setup>
import QuestsTable from '@Components/Tables/QuestsTable/QuestsTable.vue'
</script>

<template>
  <QuestsTable />

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
