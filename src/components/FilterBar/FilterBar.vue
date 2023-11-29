<script lang="ts" setup generic="DataType">
import { Ref, computed } from 'vue'

import { FilterBarProps, FilterValue } from '@Components/FilterBar/FilterBar.types'
import Button from '@Components/Button/Button.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Typography from '@Components/Typography/Typography.vue'
import Radio from '@Components/Inputs/Radio/Radio.vue'

const props = defineProps<FilterBarProps<DataType>>()

const FilterBarClassName = computed(() => [
  'filter w-25 bg-white p-2',
  props.className,
])

function chooseFilter(
  filter: FilterValue,
  refValue: Ref<FilterValue | FilterValue[] | undefined>,
) {
  if (refValue.value instanceof Array) {
    const existingRefFilterIndex = refValue.value.findIndex(
      (selectedFilter) =>
        selectedFilter === filter ||
        JSON.stringify(selectedFilter) === JSON.stringify(filter),
    )

    if (existingRefFilterIndex !== -1) {
      refValue.value.splice(existingRefFilterIndex, 1)
    } else {
      refValue.value.push(filter)
    }
  } else {
    if (
      refValue.value === filter ||
      JSON.stringify(refValue.value) === JSON.stringify(filter)
    ) {
      refValue.value = undefined
    } else {
      refValue.value = filter
    }
  }
}

function resetFilters() {
  props.filters.forEach(({ refValue }) => {
    if (refValue.value instanceof Array) {
      refValue.value = []
    } else {
      refValue.value = undefined
    }
  })
}
</script>

<template>
  <div :class="FilterBarClassName">
    <div
      v-if="title"
      class="text-center border-bottom pb-2"
    >
      <Typography class-name="text-secondary fw-semibold">{{ title }}</Typography>
    </div>

    <div
      class="w-100"
      v-for="(filter, index) in filters"
      :key="index"
    >
      <div v-if="filter.statement()">
        <Typography class-name="fw-semibold">{{ filter.category }}</Typography>

        <div class="filter__choices">
          <div
            v-for="(choice, index) in filter.choices"
            :key="index"
            class="filter__choice ps-2 py-1 rounded-1"
            @click="chooseFilter(choice.value, filter.refValue)"
          >
            <Radio
              v-if="filter.isUniqueChoice"
              :name="filter.category"
              no-form-cotrolled
              :label="choice.label"
              :value="choice.value"
              v-model="filter.refValue.value"
            />
            <Checkbox
              v-else
              :name="filter.category"
              no-form-controlled
              :label="choice.label"
              :value="choice.value"
              v-model="filter.refValue.value"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="w-100 d-flex justify-content-center">
      <Button
        variant="danger"
        prepend-icon-name="bi bi-x-lg"
        @click="resetFilters"
      >
        Сбросить фильтры
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter {
  @include flexible(stretch, flex-start, column, $gap: 8px);

  &__choices {
    max-height: 160px;

    overflow-y: scroll;
  }

  &__choice {
    cursor: pointer;

    @include flexible(center, flex-start);

    transition: background-color;

    &:hover {
      background-color: rgb(108, 117, 125, 0.1);
    }
  }
}
</style>
