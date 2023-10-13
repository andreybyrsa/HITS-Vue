<script setup lang="ts">
import { useField, useForm } from 'vee-validate'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import {
  RequestModalEmits,
  RequestModalProps,
  Letter,
} from '@Components/Modals/TeamModal/RequestModal.types'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import { computed } from 'vue'

const props = defineProps<RequestModalProps>()
const emit = defineEmits<RequestModalEmits>()

const TextareaClassName = computed(() => [
  'form-control',
  { 'is-invalid': errorMessage.value },
  'request-modal__textarea rounded',
])

const { values, resetForm, handleSubmit } = useForm<Letter>({
  validationSchema: {
    text: (value: string) =>
      value?.length > 0 ||
      (props.type == 'enter'
        ? 'Вы не написали мотивационное письмо'
        : 'Вы не указали причину'),
  },
  initialValues: {
    text: '',
    type: props.type,
  },
})

const { value, errorMessage } = useField<string>('text', {
  validateOnMount: false,
  syncVModel: true,
})

const handleSendRequest = handleSubmit(async () => {
  emit('request', values)
  resetForm()
})

function closeRequestModal() {
  emit('close-modal')
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeRequestModal"
  >
    <div class="request-modal p-3">
      <Typography class-name="text-primary d-flex justify-content-center">
        {{ type == 'enter' ? 'Мотивационное письмо' : 'Причина ухода' }}</Typography
      >
      <div class="input-group h-50">
        <textarea
          name="text"
          v-model="value"
          placeholder="Опишите причину заявления"
          :class="TextareaClassName"
        />
        <span class="invalid-feedback">
          {{ errorMessage }}
        </span>
      </div>
      <div></div>

      <Button
        class-name="rounded-end btn-primary"
        @click="handleSendRequest"
      >
        Отправить заявку
      </Button>
    </div>
  </ModalLayout>
</template>
<style lang="scss" scoped>
.request-modal {
  width: 35%;
  height: 35%;
  background-color: #e9e9e9;

  @include flexible(
    stretch,
    space-between,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );
  &__textarea {
    width: 100%;
    height: 100%;
    resize: none;
  }
}

.form-control::placeholder {
  color: $black-color;
}
</style>
