<script setup lang="ts">
import { ratingSelects } from '@Components/Modals/IdeaModal/ExpertRatingCalculator.types'
import Select from '@Components/Inputs/Select/Select.vue'
</script>

<template>
  <div class="w-50 d-flex flex-column gap-2">
    <div
      class="col"
      v-for="(select, index) in ratingSelects"
      :key="index"
    >
      <Select
        :name="select.name"
        :label="select.label"
        :options="select.choices"
        placeholder="Выберите значение"
      ></Select>
    </div>
  </div>
</template>
