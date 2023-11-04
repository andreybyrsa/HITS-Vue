<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { TeamAccession, accessionStage } from '@Domain/TeamAccession'

import {
  TeamRequestModalEmits,
  TeamRequestModalProps,
} from '@Components/Modals/TeamRequestModal/TeamRequestModal.types'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import TeamRequestPlaceholder from '@Components/Modals/TeamRequestModal/TeamRequestPlaceholder.vue'

import useUserStore from '@Store/user/userStore'

const props = defineProps<TeamRequestModalProps>()
const emit = defineEmits<TeamRequestModalEmits>()

const teamRequest = defineModel<TeamAccession>({ required: false })

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const TextareaClassName = computed(() => [
  'form-control',
  { 'is-invalid': errorMessage.value },
  'request-modal__textarea rounded',
])

const { resetForm, handleSubmit } = useForm<TeamAccession>({
  validationSchema: {
    text: (value: string) =>
      value?.length > 0 ||
      (props.type == 'ENTER'
        ? 'Вы не написали мотивационное письмо'
        : 'Вы не указали причину'),
  },
  initialValues: {
    text: teamRequest.value ? teamRequest.value.text : '',
    requestType: props.type,
  },
})

const { value, errorMessage } = useField<string>('text', {
  validateOnMount: false,
  syncVModel: true,
})

const handleSendRequest = handleSubmit(async (values) => {
  const currentUser = user.value
  if (currentUser) {
    values.targetEmail = currentUser.email
    await emit('sendRequest', values)
    resetForm()
  }
})

function closeRequestModal() {
  emit('close-modal')
}

async function handleResponse(stage: accessionStage) {
  const currentRequest = teamRequest.value
  if (currentRequest) {
    currentRequest.stage = stage
    currentRequest.updatedAt = new Date().toJSON()
    emit('response', currentRequest)
  }
  closeRequestModal()
}

function getRequestTypeStyle() {
  const className = props.type == 'LEAVE' ? ' bg-danger' : ' bg-success'
  return 'px-3 d-flex justify-content-center rounded-3 text-light' + className
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeRequestModal"
  >
    <div class="request-modal rounded-3 p-3">
      <template v-if="teamRequest || mode == 'write'">
        <Typography
          v-if="mode == 'write'"
          class-name="text-primary d-flex justify-content-center"
        >
          {{
            type == 'ENTER' ? 'Мотивационное письмо' : 'Причина ухода'
          }}</Typography
        >
        <Typography
          v-if="mode == 'read'"
          :class-name="getRequestTypeStyle()"
          >{{
            type == 'ENTER'
              ? 'Заявление на присоединение в команду'
              : 'Заявление на выход с команды'
          }}</Typography
        >
        <div class="input-group h-50">
          <textarea
            name="text"
            v-model="value"
            :placeholder="
              mode == 'write' ? 'Опишите причину заявления' : teamRequest?.text
            "
            :class="TextareaClassName"
            :disabled="mode == 'read' ? true : false"
          ></textarea>
          <span class="invalid-feedback">
            {{ errorMessage }}
          </span>
        </div>
        <div></div>

        <div
          v-if="mode == 'read'"
          class="request-modal__buttons"
        >
          <Button
            class-name="rounded-end btn-success"
            @click="handleResponse('ACCEPTED')"
          >
            Одобрить
          </Button>
          <Button
            class-name="rounded-end btn-danger"
            @click="handleResponse('REJECTED')"
          >
            Отклонить
          </Button>
        </div>
        <Button
          v-else
          class-name="rounded-end btn-primary"
          @click="handleSendRequest"
        >
          Отправить заявку
        </Button></template
      >
      <TeamRequestPlaceholder v-else></TeamRequestPlaceholder>
    </div>
  </ModalLayout>
</template>
<style lang="scss" scoped>
.request-modal {
  width: 35%;
  height: 35%;
  background-color: #e9e9e9;

  @include flexible(
    center,
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
