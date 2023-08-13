<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import {
  FilterModalProps,
  FilterModalEmits,
} from '@Components/Modals/FilterModal/FilterModal.types'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import ModalLayout from '@Components/Modals/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import { ref, watch } from 'vue'

const filters = ['Мои идеи', 'Утвержденные идеи', 'Согласованные идеи']
const selectedFilters = ref<string[]>([])

const props = defineProps<FilterModalProps>()

const emit = defineEmits<FilterModalEmits>()
watch(
  () => props.currentFilters,
  () => {
    selectedFilters.value = props.currentFilters
  },
)
</script>

<template>
  <ModalLayout :is-opened="isOpened">
    <div class="filter-modal p-3 rounded-3">
      <div class="flex justify-content-center">
        <div
          class="filter-modal-header d-flex justify-content-between align-items-center mb-3"
        >
          <Typography class-name="fs-2 text-primary">Сортировать по</Typography>
          <Button
            class-name="btn-close"
            @click="emit('close-modal')"
          ></Button>
        </div>
        <div
          class="my-3"
          v-for="(filter, index) in filters"
          :key="index"
        >
          <div class="filter-modal__checkbox">
            <Checkbox
              :label="filter"
              v-model="selectedFilters"
              :value="filter"
              class-name="fs-4"
              class="m-3 px-5"
            />
          </div>
        </div>
        <Button
          class-name="btn-primary w-100"
          @click="emit('close-modal', selectedFilters)"
          >отправить</Button
        >
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.filter-modal {
  width: 400px;
  background-color: $white-color;
  @include flexible($align-self: center, $justify-self: center);
  transition: all 0.3s ease;
}

.filter-modal-header {
  width: 350px;
  transition: all 0.3s ease;
}

.filter-modal__checkbox {
  width: 100%;
  border: 1px solid #e4e4e4;
  border-radius: 16px;
}
</style>
