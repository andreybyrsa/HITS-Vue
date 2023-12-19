<script lang="ts" setup>
import { ref } from 'vue'
import { RouteRecordRaw, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import {
  RequestTeamCollapseProps,
  hintLetter,
} from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.types.'

import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Skills from '@Components/Skills/Skills.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'
import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'

import { Team } from '@Domain/Team'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'

import TeamService from '@Services/TeamService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useRequestsToIdeaStore from '@Store/requestsToIdea/requestsToIdeaStore'
import { watchImmediate } from '@vueuse/core'

const props = defineProps<RequestTeamCollapseProps>()

const skillsAcceptedTeam = defineModel<Team>('skillsAcceptedTeam')

const notificationsStore = useNotificationsStore()
const requestToIdeaStore = useRequestsToIdeaStore()

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const currentTeam = ref<Team>()
const isOpenedConfirmModal = ref<boolean>(false)
const currentRequest = ref<RequestTeamToIdea>()
const letter = ref<string>('')

const requestTeams = defineModel<RequestTeamToIdea[]>('requestTeams', {
  required: true,
})

const { handleSubmit } = useForm({
  validationSchema: {
    letter: (value: string) => value?.length > 0 || 'Поле не заполнено',
  },
  initialValues: {
    letter: '',
  },
})

const takeTeamData = async (id: string) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.getTeam(id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }
    currentTeam.value = response
  }
}

const sendRequestTeam = handleSubmit(async () => {
  const currentUser = user.value

  if (currentUser?.token && currentTeam.value) {
    const { token } = currentUser
    const id = props.idea.id

    requestToIdeaStore.postRequest(currentTeam.value, id, letter.value, token)
  }
})

const withdrawRequestToIdea = async () => {
  const currentUser = user.value

  if (currentUser?.token && currentRequest.value) {
    const { token } = currentUser
    const { id } = currentRequest.value

    await requestToIdeaStore.updateRequestToIdea(id, 'WITHDRAWN', token)
  }
}

function navigateToUserProfile(team: Team | RequestTeamToIdea) {
  const profileRoute: RouteRecordRaw = {
    name: 'team-profile',
    path: 'team-profile/:teamId',
    alias: '/team-profile/:teamId',
    component: TeamModal,
    props: {
      canGoBack: true,
    },
  }

  router.addRoute('market', profileRoute)
  router.push({ path: `/team-profile/${team.id}` })
}

function openConfirmModal(team: Team) {
  currentRequest.value = requestTeams.value.find(
    (request) => request.teamId === team.id && request.status === 'NEW',
  )
  isOpenedConfirmModal.value = true
}

function closeConfirmModal() {
  isOpenedConfirmModal.value = false
}

function getTextStatusRequest(team: Team) {
  const currentRequestIsNew = requestTeams.value.find(
    (request) => request.teamId === team.id && request.status === 'NEW',
  )
  if (currentRequestIsNew) return 'Отозвать заявку'

  const currentRequestIsAccepted = requestTeams.value.find(
    (request) => request.teamId === team.id && request.status === 'ACCEPTED',
  )
  if (currentRequestIsAccepted) return 'Команда принята'

  const currentRequestIsCanceled = requestTeams.value.find(
    (request) => request.teamId === team.id && request.status === 'CANCELED',
  )
  if (currentRequestIsCanceled) return 'Заявка отклонена'

  const currentRequestIsAnnulated = requestTeams.value.find(
    (request) => request.teamId === team.id && request.status === 'ANNULLED',
  )
  if (currentRequestIsAnnulated) return 'Команда занята'
}

function getStyleRequest(team: Team) {
  const currentRequestIsNew = requestTeams.value.find(
    (request) => request.teamId === team.id && request.status === 'NEW',
  )
  if (currentRequestIsNew) return 'danger'

  const currentRequestIsAccepted = requestTeams.value.find(
    (request) => request.teamId === team.id && request.status === 'ACCEPTED',
  )
  if (currentRequestIsAccepted) return 'success'

  const currentRequestIsCanceled = requestTeams.value.find(
    (request) => request.teamId === team.id && request.status === 'CANCELED',
  )
  if (currentRequestIsCanceled) return 'danger'

  const currentRequestIsAnnulated = requestTeams.value.find(
    (request) => request.teamId === team.id && request.status === 'ANNULLED',
  )
  if (currentRequestIsAnnulated) return 'secondary'
}

function getDisabledRequest(team: Team) {
  return requestTeams.value.find(
    (request) =>
      request.teamId === team.id &&
      (request.status === 'ACCEPTED' ||
        request.status === 'CANCELED' ||
        request.status === 'ANNULLED'),
  )
}

function checkRequestStatusNew(team: Team) {
  const currentRequest = requestTeams.value.find(
    (request) => request.teamId === team.id && request.status !== 'WITHDRAWN',
  )
  return currentRequest && props.idea.id === currentRequest.ideaMarketId
}

const checkboxTeam = ref(false)
watchImmediate(
  () => checkboxTeam.value,
  () => {
    if (checkboxTeam.value) {
      skillsAcceptedTeam.value = currentTeam.value
    } else {
      skillsAcceptedTeam.value = undefined
    }
  },
)
</script>

<template>
  <router-view />
  <div class="team-request-collapse w-100">
    <div class="border rounded-3 py-1 px-2 overflow-hidden w-100">
      <div class="team-request-collapse__button">
        <Button
          variant="link"
          @click="navigateToUserProfile(team)"
        >
          {{ team.name }}
        </Button>
        <Button
          v-if="checkRequestStatusNew(team)"
          :variant="getStyleRequest(team)"
          @click="openConfirmModal(team)"
          :disabled="getDisabledRequest(team)"
        >
          {{ getTextStatusRequest(team) }}
        </Button>
        <Button
          v-else
          variant="primary"
          v-collapse="team.id"
          @click="takeTeamData(team.id)"
        >
          Заполнить заявку
        </Button>
      </div>

      <Collapse :id="team.id">
        <div class="team-request-collapse__info py-1">
          <div class="w-100 d-flex p-2">
            <div class="w-50">
              <div class="d-flex align-items-center text-primary pb-1">
                <div>Состав:</div>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <div
                  class="p-1 rounded bg-light border"
                  v-for="(member, index) in currentTeam?.members"
                  :key="index"
                >
                  {{ member.firstName }} {{ member.lastName }}
                </div>
              </div>
            </div>
            <div class="w-50 border-start ps-3 pb-1">
              <div class="d-flex gap-2 align-items-center text-primary pb-1">
                <Checkbox
                  v-if="!isDisabledButtonSkills"
                  name="compare"
                  :value="currentTeam"
                  v-model="checkboxTeam"
                />
                <div>Компетенции:</div>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <Skills :skills="currentTeam?.skills" />
              </div>
            </div>
          </div>

          <Textarea
            class-name="team-request-collapse__letter w-100 rounded-end"
            name="letter"
            v-model="letter"
            label="Мотивационное письмо"
            :hint="hintLetter"
          />

          <div class="d-flex gap-2">
            <Button
              class-name="btn-success"
              v-collapse="team.id"
              @click="sendRequestTeam()"
            >
              Подать заявку
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  </div>

  <ConfirmModal
    :is-opened="isOpenedConfirmModal"
    text-button="Отклонить заявку"
    text-question="Вы действительно хотите отозвать заявку?"
    @close-modal="closeConfirmModal"
    @action="withdrawRequestToIdea"
  />
</template>

<style lang="scss">
.team-request-collapse {
  @include flexible(flex-start, flex-start, column, $gap: 8px);

  &__button {
    @include flexible(center, space-between);
  }

  &__info {
    @include flexible(flex-start, flex-start, column, $gap: 8px);
  }

  &__letter {
    resize: none;
    height: 200px;
  }
}
</style>
