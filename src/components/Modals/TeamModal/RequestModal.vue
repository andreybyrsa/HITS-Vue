<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { computed } from 'vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { TeamRequest } from '@Domain/TeamRequest'

import {
  RequestModalEmits,
  RequestModalProps,
} from '@Components/Modals/TeamModal/RequestModal.types'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'

const props = defineProps<RequestModalProps>()
const emit = defineEmits<RequestModalEmits>()

const TextareaClassName = computed(() => [
  'form-control',
  { 'is-invalid': errorMessage.value },
  'request-modal__textarea rounded',
])

const { values, resetForm, handleSubmit } = useForm<TeamRequest>({
  validationSchema: {
    text: (value: string) =>
      value?.length > 0 ||
      (props.type == 'enter'
        ? 'Вы не написали мотивационное письмо'
        : 'Вы не указали причину'),
  },
  initialValues: {
    sender: props.sender,
    text: props.request ? props.request.text : '',
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

const handleApprove = async () => {
  const curreuntRequest = props.request
  if (curreuntRequest) {
    curreuntRequest.isApproved = true
    emit('response', curreuntRequest)
    closeRequestModal()
  }
}

const handleReject = async () => {
  const curreuntRequest = props.request
  if (curreuntRequest) {
    curreuntRequest.isApproved = false
    emit('response', curreuntRequest)
    closeRequestModal()
  }
}

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
          :disabled="request ? true : false"
        />
        <span class="invalid-feedback">
          {{ errorMessage }}
        </span>
      </div>
      <div></div>

      <template v-if="request">
        >
        <div class="request-modal__buttons">
          <Button
            class-name="rounded-end btn-primary"
            @click="handleApprove"
          >
            Одобрить
          </Button>
          <Button
            class-name="rounded-end btn-primary"
            @click="handleReject"
          >
            Отклонить
          </Button>
        </div></template
      >
      <template v-else>
        ><Button
          class-name="rounded-end btn-primary"
          @click="handleSendRequest"
        >
          Отправить заявку
        </Button></template
      >
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
  &__buttons {
    @include flexible(stretch, center, $gap: 16px);
  }
}

.form-control::placeholder {
  color: $black-color;
}
</style>
