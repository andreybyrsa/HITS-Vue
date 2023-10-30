<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { computed } from 'vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { TeamRequest } from '@Domain/TeamRequest'

import {
  TeamRequestModalEmits,
  TeamRequestModalProps,
} from '@Components/Modals/TeamRequestModal/TeamRequestModal.types'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import TeamRequestPlaceholder from '@Components/Modals/TeamRequestModal/TeamRequestPlaceholder.vue'

import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'

const props = defineProps<TeamRequestModalProps>()
const emit = defineEmits<TeamRequestModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
    text: props.request ? props.request.text : '',
    type: props.type,
  },
})

const { value, errorMessage } = useField<string>('text', {
  validateOnMount: false,
  syncVModel: true,
})

const handleSendRequest = handleSubmit(async () => {
  const currentUser = user.value
  if (currentUser) {
    values.sender = currentUser
    emit('sendRequest', values)
    resetForm()
    closeRequestModal()
  }
})

const handleApprove = async () => {
  const curreuntRequest = props.request
  if (curreuntRequest) {
    emit('accept', curreuntRequest.id)
    closeRequestModal()
  }
}

const handleReject = async () => {
  const curreuntRequest = props.request
  if (curreuntRequest) {
    emit('reject', curreuntRequest.id)
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
        ></textarea>
        <span class="invalid-feedback">
          {{ errorMessage }}
        </span>
      </div>
      <div></div>

      <template v-if="request && mode == 'read'">
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
        <Button
          class-name="rounded-end btn-primary"
          @click="handleSendRequest"
        >
          Отправить заявку
        </Button></template
      >
    </div>
    <TeamRequestPlaceholder
      v-if="mode == 'read' && !request"
    ></TeamRequestPlaceholder>
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
