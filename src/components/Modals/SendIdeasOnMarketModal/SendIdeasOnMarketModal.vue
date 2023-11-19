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

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

defineProps<SendIdeasOnMarketModalProps>()

const emit = defineEmits<SendIdeasOnMarketModalEmits>()

const dateStart = ref<string>('')
const dateFinish = ref<string>('')

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

async function sendIdeasToMarket(ideas: Idea[]) {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser

    ideas.every(async (idea) => {
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
        return Error
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

      console.log(ideaMarket)
    })
  }
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="send-ideas-on-market-modal bg-white rounded p-3">
      <div
        v-for="(idea, index) in ideas"
        :key="index"
        class="send-ideas-on-market-modal__idea-date border rounded p-2 w-100"
      >
        <Typography class-name="fs-5 text-primary w-100">
          {{ idea.name }}
        </Typography>
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
            label="Дата окночания*"
            class-name="rounded"
            v-model="dateFinish"
            placeholder="Дата окончания"
          />
        </div>
      </div>
      <div class="d-flex gap-2">
        <Button
          v-if="ideas"
          variant="primary"
          @click="sendIdeasToMarket(ideas)"
        >
          Отправить на биржу
        </Button>
        <Button variant="danger"> Закрыть окно </Button>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.send-ideas-on-market-modal {
  width: 500px;
  max-height: 300px;
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
    @include flexible(flex-start, flex-start, column, $gap: 8px);
  }
}

.modal-layout-enter-from .letter-modal,
.modal-layout-leave-to .letter-modal {
  transform: scale(0.9);
}
</style>
