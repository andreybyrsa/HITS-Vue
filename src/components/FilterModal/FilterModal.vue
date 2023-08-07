<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import {
  FilterModalProps,
  FilterModalEmits,
} from '@Components/FilterModal/FilterModal.types'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import ModalLayout from '@Components/Modals/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'

defineProps<FilterModalProps>()

const emit = defineEmits<FilterModalEmits>()
</script>

<template>
  <ModalLayout :is-opened="isOpened">
    <div class="filter-modal p-3 rounded-3">
      <div class="flex justify-content-center">
        <div
          class="filter-modal-header d-flex justify-content-between align-items-center mb-3"
        >
          <div></div>
          <Typography class-name="fs-2 text-primary">Сортировать по</Typography>
          <Button
            class-name="btn-close"
            @click="emit('close-modal')"
          ></Button>
        </div>
        <div class="my-3">
          <div class="filter-modal__checkbox">
            <Checkbox
              label="Мои идеи"
              class-name="fs-4"
              class="m-3 px-5"
            ></Checkbox>
          </div>
        </div>
        <div class="my-3">
          <div class="filter-modal__checkbox">
            <Checkbox
              label="Все идеи"
              class-name="fs-4"
              class="m-3 px-5"
            ></Checkbox>
          </div>
        </div>
        <div class="my-3">
          <div class="filter-modal__checkbox">
            <Checkbox
              label="Утвержденные идеи"
              class-name="fs-4"
              class="m-3 px-5"
            ></Checkbox>
          </div>
        </div>
        <div class="my-3">
          <div class="filter-modal__checkbox">
            <Checkbox
              label="Согласованные идеи"
              class-name="fs-4"
              class="m-3 px-5"
            ></Checkbox>
          </div>
        </div>
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
