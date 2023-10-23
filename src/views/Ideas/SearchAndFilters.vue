<script lang="ts" setup generic="FilterType">
import { ref } from 'vue'

import Filter from '@Components/Modals/FilterModal/Filter.types'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import FilterModal from '@Components/Modals/FilterModal/FilterModal.vue'
import SearchAndFiltersProps from '@Views/Ideas/SearchAndFilters.types'

const props = defineProps<SearchAndFiltersProps<FilterType>>()

const searchedValue = defineModel<string>('searchedValue', {
  required: true,
})
const selectedFilters = defineModel('selectedFilters', {
  required: true,
})

const isOpenedFilterModal = ref(false)

function handleOpenFilterModal() {
  isOpenedFilterModal.value = true
}

function handleCloseFilterModal() {
  isOpenedFilterModal.value = false
}

function handleSetFilters(filters: Filter<FilterType>[]) {
  selectedFilters.value = filters
}
</script>

<template>
  <div class="search bg-primary rounded-3 p-2 w-75">
    <Input
      name="search-input"
      class-name="rounded-end"
      v-model="searchedValue"
      placeholder="Поиск идей по названию"
    >
      <template #prepend>
        <i class="bi bi-search"></i>
      </template>
    </Input>

    <Button
      class-name="btn-light"
      prepend-icon-name="bi bi-funnel"
      @click="handleOpenFilterModal"
    >
      Фильтр
    </Button>
    <FilterModal
      :filters="props.filtersData"
      :is-opened="isOpenedFilterModal"
      @close-modal="handleCloseFilterModal"
      @set-filters="handleSetFilters"
      :current-filters="[...selectedFilters]"
    />
  </div>
</template>

<style lang="scss" scoped>
.search {
  @include flexible(stretch, space-between, $gap: 8px);
}
</style>
