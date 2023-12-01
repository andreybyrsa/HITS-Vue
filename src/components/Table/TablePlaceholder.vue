<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
</script>

<template>
  <div class="w-100">
    <table class="table mb-0">
      <thead>
        <tr>
          <th
            v-for="index in 6"
            :key="index"
          >
            <LoadingPlaceholder />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="index in 5"
          :key="index"
        >
          <td
            v-for="index in 6"
            :key="index"
            class="table__cell"
          >
            <div class="h-100 d-flex align-items-center">
              <LoadingPlaceholder v-if="index === 1" />
              <LoadingPlaceholder
                v-else
                height="small"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.table {
  &__cell {
    height: 50px;
  }
}
</style>
