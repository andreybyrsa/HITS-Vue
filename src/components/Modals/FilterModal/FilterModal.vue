<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import {
  FilterModalProps,
  FilterModalEmits,
} from '@Components/Modals/FilterModal/FilterModal.types'
import { storeToRefs } from 'pinia'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import ModalLayout from '@Components/Modals/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import { ref, watch } from 'vue'
import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const filters = [
  {
    label: 'Мои идеи',
    // value: 'pochta@mail.com',
    value: user.value?.email,
  },
  {
    label: 'Утвержденные идеи',
    value: 'CONFIRMED',
  },
  {
    label: 'Согласованные идеи',
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
</script>
<template>
  <ModalLayout :is-opened="isOpened">
    <div class="filter-modal card card-body">
      <div class="filter-modal__header">
        <Typography class-name="fs-2 text-primary">Сортировать по</Typography>
        <Button
          class-name="btn-close"
          @click="emit('close-modal')"
        />
      </div>
      <div
        v-for="(filter, index) in filters"
        :key="index"
        class="filter-modal__checkbox"
      >
        <Checkbox
          name="checkbox"
          :label="filter.label"
          v-model="selectedFilters"
          :value="filter.value"
          class-name="fs-5"
        />
      </div>
      <Button
        class-name="btn-primary w-100"
        @click="emit('close-modal', selectedFilters)"
        >Применить</Button
      >
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.filter-modal {
  max-width: 400px;
  @include flexible($align-self: center, $justify-self: center, $gap: 12px);

  &__header {
    width: 350px;
    @include flexible(center, space-between);
  }

  &__checkbox {
    margin-left: 10px;
  }
}
</style>
