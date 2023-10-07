<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
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

function handleAddFilters(filter: string) {
  const repeatFilter = selectedFilters.value.find((e) => e == filter)
  if (repeatFilter) {
    const index = selectedFilters.value.indexOf(repeatFilter)
    selectedFilters.value.splice(index, 1)
  } else selectedFilters.value.push(filter)
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
          v-for="(filter, index) in props.filters"
          :key="index"
          class="list-group-item list-group-item-action"
        >
          <div
            v-if="filter.label !== 'Компетенции'"
            @click="handleAddFilters(filter.value as string)"
          >
            <Checkbox
              name="checkbox"
              :label="filter.label"
              v-model="selectedFilters"
              :value="filter.value"
            />
          </div>

          <div v-else>
            <Button
              type="button"
              class-name="btn-primary text-center w-100"
              v-dropdown="'FilterModal'"
              >Компетенции
            </Button>
            <DropDown
              class-name="w-75"
              id="FilterModal"
            >
              <div
                v-for="(drop, index) in filter.valueDrop"
                class="list-group-item list-group-item-action"
                :key="index"
              >
                <Checkbox
                  name="checkbox"
                  :label="drop"
                  v-model="selectedFilters"
                  :value="filter.value"
                />
              </div>
            </DropDown>
          </div>
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
