<script lang="ts" setup generic="FilterType">
import Button from '@Components/Button/Button.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Typography from '@Components/Typography/Typography.vue'
import { computed, ref, Ref } from 'vue'

import { FilterBarProps } from '@Components/FilterBar/FilterBar.types'
import Radio from '@Components/Inputs/Radio/Radio.vue'

defineModel<FilterType | FilterType[]>({ required: true })

const props = defineProps<FilterBarProps<FilterType>>()
const currentFilters = ref(props.filters) as Ref<FilterType[]>
const value = ref(false)
</script>

<template>
  <div class="filter border rounded-3 p-2 ms-3 bg-white bg-opacity-50">
    <div class="filter__header border-bottom pb-2">
      <Typography class-name="text-primary fs-4">Фильтр</Typography>
      <!-- <Button
        prepend-icon-name="bi bi-x-lg"
        @click="isOpened = false"
      ></Button> -->
    </div>

    <div
      class="w-100 rounded-3 p-2"
      v-for="filter in props.filters"
      :key="filter"
    >
      <Typography class-name="fs-5 fw-bold">{{ filter.category }}</Typography>
      <div
        class="filter__elemet rounded-pill p-2 ps-3"
        v-for="choice in filter.choices"
        :key="choice"
      >
        <Radio
          :name="filter.category"
          v-if="filter.isUniqueChoice === true"
        ></Radio>
        <Checkbox
          :name="filter.category"
          v-if="filter.isUniqueChoice === false"
        ></Checkbox>

        <Typography class-name=" ms-1">{{ choice }}</Typography>
      </div>
    </div>

    <div class="w-100 d-flex justify-content-center">
      <Button
        @click="resetFilters"
        class-name="bg-primary text-light "
        >Сбросить фильтры</Button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter {
  width: 25%;

  padding: 16px;
  padding-top: 0;
  @include flexible(start, start, column, $gap: 10px);

  &__header {
    width: 100%;
    @include flexible(center, center);
  }

  &__elemet {
    width: 100%;
    @include flexible(center, start);
  }

  &__elemet:hover {
    background-color: rgb(228, 228, 228);
  }
}
</style>
