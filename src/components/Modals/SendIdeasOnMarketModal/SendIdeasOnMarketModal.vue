<script lang="ts" setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import {
  SendIdeasOnMarketModalProps,
  SendIdeasOnMarketModalEmits,
} from '@Components/Modals/SendIdeasOnMarketModal/SendIdeasOnMarketModal.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'

import IdeasService from '@Services/IdeasService'
import useUserStore from '@Store/user/userStore'

import { Idea } from '@Domain/Idea'
import IdeasMarket from '@Domain/IdeasMarket'
import IdeasMarketService from '@Services/IdeasMarketService'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

defineProps<SendIdeasOnMarketModalProps>()

const emit = defineEmits<SendIdeasOnMarketModalEmits>()

const checkedIdeas = defineModel<Idea[]>('checkedIdeas', { required: true })
const ideas = defineModel<Idea[]>('ideas', { required: true })

const dateStart = ref<string>('')
const dateFinish = ref<string>('')

const isLoading = ref(false)

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

const sendIdeasToMarket = handleSubmit(async () => {
  const currentUser = user.value
  isLoading.value = true

  if (currentUser?.token) {
    const { token } = currentUser

    checkedIdeas.value.every(async (idea) => {
      const {
        id,
        initiator,
        createdAt,
        name,
        problem,
        description,
        solution,
        result,
        maxTeamSize,
        customer,
      } = idea

      const responseSkillsIdea = await IdeasService.getIdeaSkills(id, token)

      if (responseSkillsIdea instanceof Error) {
        return
      }

      const skills = responseSkillsIdea.skills

      const ideaMarket: IdeasMarket = {
        id: id,
        initiator: initiator,
        createdAt: createdAt,
        name: name,
        problem: problem,
        description: description,
        solution: solution,
        result: result,
        maxTeamSize: maxTeamSize,
        customer: customer,

        position: 0,
        stack: skills,
        status: 'RECRUITMENT_IS_OPEN',
        requests: 0,
        acceptedRequests: 0,
        isFavorite: false,
        startDate: dateStart.value,
        finishDate: dateFinish.value,
      }

      const responseSendIdeaOnMarket = await IdeasMarketService.sendIdeaOnMarket(
        ideaMarket,
        token,
      )
      if (responseSendIdeaOnMarket instanceof Error) {
        return
      }

      const responseDeleteIdea = await IdeasService.deleteIdea(id, token)
      if (responseDeleteIdea instanceof Error) {
        return
      }

      ideas.value = ideas.value.filter((elem) => elem.id != idea.id)
      isLoading.value = false
      emit('close-modal')
    })
  }
})

function deleteIdea(ideaId: string) {
  checkedIdeas.value = checkedIdeas.value.filter((elem) => elem.id != ideaId)
  if (checkedIdeas.value.length == 1) {
    emit('close-modal')
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
          v-model="dateStart"
          placeholder="Дата старта"
        />
        <Input
          name="dateFinish"
          type="date"
          label="Дата окончания*"
          class-name="rounded"
          v-model="dateFinish"
          placeholder="Дата окончания"
        />
      </div>
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
}

.modal-layout-enter-from .letter-modal,
.modal-layout-leave-to .letter-modal {
  transform: scale(0.9);
}
</style>
