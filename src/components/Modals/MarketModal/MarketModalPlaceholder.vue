<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
</script>

<template>
  <div class="market-modal market-modal-placeholder p-3 h-100 overflow-y-scroll">
    <div class="market-modal-placeholder__left-side w-75 h-100">
      <div class="w-75">
        <LoadingPlaceholder />
      </div>

      <div class="p-2 bg-white rounded-3 d-flex flex-column gap-1">
        <div class="w-50">
          <LoadingPlaceholder />
        </div>

        <LoadingPlaceholder />
        <LoadingPlaceholder />
      </div>

      <TablePlaceholder />

      <div class="p-2 bg-white rounded-3 gap-2 d-flex">
        <div
          v-for="index in 3"
          :key="index"
          class="w-25 h-25"
        >
          <LoadingPlaceholder height="small" />
        </div>
      </div>
    </div>

    <div class="market-modal-placeholder__right-side p-2 w-25 bg-white rounded">
      <div class="d-flex gap-2 w-100 px-1 pt-1">
        <div class="bg-primary w-50 py-3 rounded-3"></div>
        <div class="bg-primary w-50 py-3 rounded-3"></div>
      </div>

      <div class="px-1">
        <div
          v-for="index in 3"
          :key="index"
          :class="`w-${index * 50}`"
        >
          <LoadingPlaceholder />
        </div>
      </div>

      <div class="px-1">
        <div
          v-for="index in 3"
          :key="index"
          :class="`w-${index * 50}`"
        >
          <LoadingPlaceholder />
        </div>

        <LoadingPlaceholder />
      </div>

      <div class="px-1 pb-1">
        <div class="w-100">
          <LoadingPlaceholder />
        </div>
        <div class="w-75">
          <LoadingPlaceholder />
        </div>
        <div class="w-75">
          <LoadingPlaceholder />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.market-modal-placeholder {
  &__left-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }

  &__right-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
}
</style>
