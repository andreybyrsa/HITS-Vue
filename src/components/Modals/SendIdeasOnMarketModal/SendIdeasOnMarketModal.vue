<script lang="ts" setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { watchImmediate } from '@vueuse/core'

import {
  SendIdeasOnMarketModalProps,
  SendIdeasOnMarketModalEmits,
} from '@Components/Modals/SendIdeasOnMarketModal/SendIdeasOnMarketModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { Idea } from '@Domain/Idea'
import IdeasMarket from '@Domain/IdeasMarket'

import IdeasMarketService from '@Services/IdeasMarketService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useIdeasStore from '@Store/ideas/ideasStore'

const props = defineProps<SendIdeasOnMarketModalProps>()
const emit = defineEmits<SendIdeasOnMarketModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasStore = useIdeasStore()

const notificationsStore = useNotificationsStore()

const checkedIdeas = ref<Idea[]>([])

const isLoading = ref(false)

watchImmediate(
  () => props.checkedIdeas,
  (ideas) => {
    checkedIdeas.value = ideas
  },
  { deep: true },
)

const { handleSubmit } = useForm({
  validationSchema: {
    dateStart: (value: string) => value?.length > 0 || 'Поле не заполнено',
    dateFinish: (value: string) => value?.length > 0 || 'Поле не заполнено',
  },
  initialValues: {
    dateStart: '',
    dateFinish: '',
  },
})

const sendIdeasToMarket = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const ideasMarket: IdeasMarket[] = checkedIdeas.value.map((idea) => {
      return {
        ...idea,
        position: 0,
        status: 'RECRUITMENT_IS_OPEN',
        requests: 0,
        acceptedRequests: 0,
        isFavorite: false,
        startDate: values.dateStart,
        finishDate: values.dateFinish,
      } as unknown as IdeasMarket
    })

    isLoading.value = true
    const response = await IdeasMarketService.sendIdeaOnMarket(ideasMarket, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    ideasStore.changeIdeasStatusOnMarket(checkedIdeas.value)

    isLoading.value = false
    emit('close-modal')
    emit('reset-checked-ideas')
  }
})

function deleteIdea(ideaId: string) {
  const ideaIndex = checkedIdeas.value.findIndex(({ id }) => id === ideaId)

  if (ideaIndex !== -1) {
    checkedIdeas.value.splice(ideaIndex, 1)

    if (checkedIdeas.value.length === 0) emit('close-modal')
  }
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="send-ideas-on-market-modal bg-white rounded p-3">
      <div class="send-ideas-on-market-modal__idea-date w-100">
        <Typography class-name="fs-5 w-100 text-secondary border-bottom">
          Укажите сроки набора команд
        </Typography>
        <Button
          variant="close"
          @click="emit('close-modal')"
        />
      </div>

      <div class="d-flex gap-2 w-100">
        <Input
          name="dateStart"
          type="date"
          label="Дата старта*"
          class-name="rounded"
          placeholder="Дата старта"
          validate-on-update
        />
        <Input
          name="dateFinish"
          type="date"
          label="Дата окончания*"
          class-name="rounded"
          placeholder="Дата окончания"
          validate-on-update
        />
      </div>
      <div class="send-ideas-on-market-modal__ideas d-flex flex-column gap-2 w-100">
        <div
          v-for="(idea, index) in checkedIdeas"
          :key="index"
          class="d-flex gap-2 w-100"
        >
          <Typography class-name="text-primary w-100 border rounded p-2">
            {{ idea.name }}
          </Typography>
          <Button
            variant="outline-danger"
            append-icon-name="bi bi-x"
            @click="deleteIdea(idea.id)"
          />
        </div>
      </div>

      <Button
        variant="primary"
        @click="sendIdeasToMarket"
        :is-loading="isLoading"
      >
        Отправить на биржу
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.send-ideas-on-market-modal {
  width: 500px;
  max-height: 400px;
  overflow-y: scroll;

  @include flexible(
    flex-start,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 8px
  );

  transition: all $default-transition-settings;

  &__idea-date {
    @include flexible(center, space-between, $gap: 8px);
  }

  &__ideas {
    max-height: 192px;
    overflow-y: scroll;
  }
}

.modal-layout-enter-from .letter-modal,
.modal-layout-leave-to .letter-modal {
  transform: scale(0.9);
}
</style>
