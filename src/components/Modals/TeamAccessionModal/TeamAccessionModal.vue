<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { TeamAccession, accessionStage } from '@Domain/TeamAccession'

import {
  TeamAccessionModalEmits,
  TeamAccessionModalProps,
} from '@Components/Modals/TeamAccessionModal/TeamAccessionModal.types'

import Typography from '@Components/Typography/Typography.vue'
import TeamAccessionPlaceholder from '@Components/Modals/TeamAccessionModal/TeamAccessionPlaceholder.vue'
import TeamAccessionButtons from '@Components/Modals/TeamAccessionModal/TeamAccessionButtons.vue'

import useUserStore from '@Store/user/userStore'

const props = defineProps<TeamAccessionModalProps>()
const emit = defineEmits<TeamAccessionModalEmits>()

const teamAccession = defineModel<TeamAccession>({ required: false })

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
    text: teamAccession.value ? teamAccession.value.text : '',
    requestType: props.type,
  },
})

const { value, errorMessage } = useField<string>('text', {
  validateOnMount: false,
  syncVModel: true,
})

const handleSendRequest = handleSubmit(async (values: TeamAccession) => {
  const currentUser = user.value
  if (currentUser) {
    values.targetEmail = currentUser.email
    emit('sendRequest', values)
    resetForm()
  }
})

function closeRequestModal() {
  emit('closeModal')
}

async function handleResponseToRequest(stage: accessionStage) {
  const currentRequest = teamAccession.value
  if (currentRequest) {
    currentRequest.stage = stage
    currentRequest.updatedAt = new Date().toJSON()
    emit('responseToRequest', currentRequest)
  }
  closeRequestModal()
}

async function handleResponseToInvitation(stage: accessionStage) {
  const currentRequest = teamAccession.value
  if (currentRequest) {
    currentRequest.stage = stage
    currentRequest.updatedAt = new Date().toJSON()
    emit('responseToRequest', currentRequest)
  }
  closeRequestModal()
}

function getRequestTypeStyle() {
  const className =
    teamAccession.value?.requestType == 'LEAVE' ? ' bg-danger' : ' bg-success'
  return 'px-3 d-flex justify-content-center rounded-3 text-light' + className
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeRequestModal"
  >
    <div class="request-modal rounded-3 p-3">
      <template v-if="teamAccession || mode == 'write'">
        <Typography
          v-if="mode == 'write'"
          class-name="text-primary d-flex justify-content-center"
        >
          {{
            type == 'ENTER' ? 'Мотивационное письмо' : 'Причина ухода'
          }}</Typography
        >
        <Typography
          v-if="mode == 'read' && teamAccession?.stage == 'REQUEST'"
          :class-name="getRequestTypeStyle()"
          >{{
            type == 'ENTER'
              ? 'Заявление на присоединение в команду'
              : 'Заявление на выход с команды'
          }}</Typography
        >
        <Typography
          v-if="mode == 'read' && teamAccession?.stage == 'INVITATION'"
          :class-name="getRequestTypeStyle()"
          >Приглашение в команду</Typography
        >
        <div class="input-group h-50">
          <textarea
            name="text"
            v-model="value"
            :placeholder="
              mode == 'write'
                ? type == 'ENTER'
                  ? 'Опишите причину вступления'
                  : 'Опишите причину выхода'
                : teamAccession?.text
            "
            :class="TextareaClassName"
            :disabled="mode == 'read' ? true : false"
          ></textarea>
          <span class="invalid-feedback">
            {{ errorMessage }}
          </span>
        </div>
        <TeamAccessionButtons
          @response-to-request="handleResponseToRequest"
          @response-to-invitation="handleResponseToInvitation"
          @send-request="handleSendRequest"
          @invite="emit('invite')"
          :team-request="teamAccession"
          :mode="mode"
        />
      </template>
      <TeamAccessionPlaceholder v-else />
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
}

.form-control::placeholder {
  color: $black-color;
}
</style>
