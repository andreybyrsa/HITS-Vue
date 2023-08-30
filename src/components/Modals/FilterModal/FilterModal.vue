<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import {
  FilterModalProps,
  FilterModalEmits,
} from '@Components/Modals/FilterModal/FilterModal.types'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Typography from '@Components/Typography/Typography.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const filters = [
  {
    label: 'Мои идеи',
    value: user.value?.email,
  },
  {
    label: 'На согласованнии',
    value: 'ON_APPROVAL',
  },
  {
    label: ' На утверждении',
    value: 'ON_CONFIRMATION',
  },
]
const selectedFilters = ref<string[]>([])

const props = defineProps<FilterModalProps>()

const emit = defineEmits<FilterModalEmits>()

watch(
  () => props.currentFilters,
  () => {
    selectedFilters.value = props.currentFilters
  },
)

function handleSetFilters() {
  emit('set-filters', selectedFilters.value)
  emit('close-modal')
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="filter-modal p-3 bg-white rounded-3">
      <div class="filter-modal__header">
        <Typography class-name="fs-3 text-primary">Сортировать по</Typography>
        <Button
          class-name="btn-close"
          @click="emit('close-modal')"
        ></Button>
      </div>

      <ul class="list-group">
        <div
          v-for="(filter, index) in filters"
          :key="index"
          class="list-group-item list-group-item-action"
        >
          <Checkbox
            name="checkbox"
            :label="filter.label"
            v-model="selectedFilters"
            :value="filter.value"
          />
        </div>
      </ul>

      <Button
        class-name="btn-primary w-100"
        @click="handleSetFilters"
      >
        Применить
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.filter-modal {
  width: 400px;

  @include flexible(
    stretch,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  &__header {
    @include flexible(center, space-between);
  }

  transition: all $default-transition-settings;
}

.modal-layout-enter-from .filter-modal,
.modal-layout-leave-to .filter-modal {
  transform: scale(0.9);
}
</style>
