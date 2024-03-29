<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useMagicKeys } from '@vueuse/core'

import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import {
  Send360SurveyProps,
  Send360SurveyEmits,
} from '@Components/Modals/Send360SurveyModal/Send360SurveyModal.type'
import Survey360Form from '@Components/Forms/Survey360Form/Survey360Form.vue'

const props = defineProps<Send360SurveyProps>()
const emit = defineEmits<Send360SurveyEmits>()

function close() {
  emit('close-modal')
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
    class="modal-360-survey"
  >
    <div class="modal-360-survey bg-white rounded p-3">
      <Survey360Form @close-modal="close" />
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.modal-360-survey {
  width: 90%;
  height: 900px;
  @include flexible(
    stretch,
    flex-start,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }
}
</style>
