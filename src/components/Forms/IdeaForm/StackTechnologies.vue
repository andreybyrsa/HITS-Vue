<script lang="ts" setup>
import { ref } from 'vue'

import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'

const stackValue = defineModel<unknown[]>({
  required: true,
})

const stack = ref([
  'JavaScript',
  'React JS',
  'Vue 3',
  'Spring Boot',
  'Django Rest API',
  'Mongo DB',
  'PostgreSQL',
])

function unselectTechnology(index: number) {
  stackValue.value.splice(index, 1)
}
</script>

<template>
  <div>
    <Typography class="fs-6 text-primary">Стек технологий*</Typography>
    <Combobox
      class="mt-2"
      :options="stack"
      v-model="stackValue"
      placeholder="Выберите инструмент разработки"
      :selection-placeholder="
        stackValue.length ? `Выбрано ${stackValue.length}` : ''
      "
      required
      multiple
    />

    <div
      v-if="stackValue.length"
      class="technology mt-2"
    >
      <div
        v-for="(technology, index) in stackValue"
        :key="index"
        class="d-flex gap-1 px-2 py-1 rounded-3 bg-success text-white"
      >
        <Typography>
          {{ technology }}
        </Typography>
        <Icon
          class-name="technology__remove-icon bi bi-x-lg"
          @click="unselectTechnology(index)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.technology {
  @include flexible(center, flex-start, $flex-wrap: wrap, $gap: 4px);

  &__remove-icon {
    cursor: pointer;
  }
}
</style>
