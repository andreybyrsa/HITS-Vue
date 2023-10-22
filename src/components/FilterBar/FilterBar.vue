<script lang="ts" setup generic="FilterType">
import Button from '@Components/Button/Button.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Typography from '@Components/Typography/Typography.vue'
import { computed, ref, Ref } from 'vue'

import { FilterBarProps } from '@Components/FilterBar/FilterBar.types'
import Radio from '@Components/Inputs/Radio/Radio.vue'

defineModel<FilterType | FilterType[]>({ required: true })

const props = defineProps<FilterBarProps<FilterType>>()

const value = ref(false)

const selectedChoiceRadio = ref([])
const selectedChoiceCheckbox = ref([])

function resetFilters() {
  selectedChoiceRadio.value = []
  selectedChoiceCheckbox.value = []
}
</script>

<template>
  <div class="filter border rounded-3 p-2 ms-3 bg-white bg-opacity-50">
    <div class="filter__header border-bottom pb-2">
      <Typography class-name="text-primary fs-4">Фильтр</Typography>
    </div>

    <div
      class="filter__container w-100 rounded-3 p-2"
      v-for="(filter, index) in props.filters"
      :key="index"
    >
      <Typography class-name="fs-5 fw-bold">{{ filter.category }}</Typography>
      <div
        class="filter__elemet rounded-pill p-2 ps-3"
        v-for="(choice, index) in filter.choices"
        :key="index"
      >
        <Radio
          name="choice"
          :value="choice"
          v-model="selectedChoiceRadio"
          v-if="filter.isUniqueChoice === true"
        ></Radio>
        <Checkbox
          name="choice"
          :value="choice"
          v-model="selectedChoiceCheckbox"
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
  padding: 16px;
  padding-top: 0;
  height: 100%;
  overflow-y: auto;
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

  &__container {
    overflow-y: auto;
    min-height: 200px;
  }
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgb(209, 209, 209);
  border-radius: 20px;
}

::-webkit-scrollbar-thumb {
  background-color: #0d6efd;
  border-radius: 20px;
  border: 3px solid #0d6efd;
}
</style>
