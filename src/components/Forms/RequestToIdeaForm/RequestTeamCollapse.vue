<script lang="ts" setup>
import { ref } from 'vue'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { RequestTeamToIdea, RequestToIdeaStatus, Team } from '@Domain'
import { useUserStore, useNotificationsStore, useRequestsToIdeaStore } from '@Store'
import { TeamService } from '@Service'
import {
  RequestTeamCollapseProps,
  hintLetter,
} from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.types.'
import { ButtonVariants } from '@Components/Button/Button.types'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Skills from '@Components/Skills/Skills.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'
import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'

const props = defineProps<RequestTeamCollapseProps>()
const skillsAcceptedTeam = defineModel<Team>('skillsAcceptedTeam')
const notificationsStore = useNotificationsStore()

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const currentTeam = ref<Team>()
const isOpenedConfirmModal = ref<boolean>(false)
const currentRequest = ref<RequestTeamToIdea>()
const checkboxTeam = ref(false)

const requestsToIdeaStore = useRequestsToIdeaStore()
const { requests } = storeToRefs(requestsToIdeaStore)

const { handleSubmit } = useForm({
  validationSchema: {
    letter: (value: string) => value?.length > 0 || 'Поле не заполнено',
  },
  initialValues: {
    letter: '',
  },
})

const takeTeamData = async (id: string) => {
  const response = await TeamService.getTeam(id)

  if (response instanceof Error) {
    return notificationsStore.createSystemNotification('Система', response.message)
  }

  currentTeam.value = response
}

const sendRequestTeam = handleSubmit(async (values) => {
  if (currentTeam.value) {
    const id = props.idea.id
    const marketId = route.params.marketId.toString()

    requestsToIdeaStore.postRequest(currentTeam.value, id, marketId, values.letter)
  }
})

const withdrawRequestToIdea = async () => {
  if (currentRequest.value) {
    const { id } = currentRequest.value
    await requestsToIdeaStore.updateRequestToIdea(id, 'WITHDRAWN')
  }
}

function navigateToTeamProfile(team: Team) {
  const profileRoute: RouteRecordRaw = {
    name: 'team-profile',
    path: 'team-profile/:teamId',
    alias: '/team-profile/:teamId',
    component: TeamModal,
    props: {
      canGoBack: true,
    },
  }

  router.addRoute('market-ideas', profileRoute)
  router.push({ path: `/team-profile/${team.id}` })
}

function openConfirmModal(team: Team) {
  currentRequest.value = requests.value.find(
    (request) => request.teamId === team.id && request.status === 'NEW',
  )
  isOpenedConfirmModal.value = true
}

function closeConfirmModal() {
  isOpenedConfirmModal.value = false
}

function formatDataButtonByStatus(
  currentRequestStatus: (false | RequestToIdeaStatus)[],
) {
  const initialData = ref<{ variant: ButtonVariants; text: string }>({
    variant: 'primary',
    text: 'Подать заявку',
  })

  if (currentRequestStatus.includes('CANCELED')) {
    initialData.value = { variant: 'danger', text: 'Заявка отклонена' }
  }
  if (currentRequestStatus.includes('ANNULLED')) {
    initialData.value = { variant: 'secondary', text: 'Команда в работе' }
  }
  if (currentRequestStatus.includes('WITHDRAWN')) {
    initialData.value = { variant: 'primary', text: 'Подать заявку' }
  }
  return initialData.value
}

function getStyleRequest(team: Team) {
  const { id } = team
  const currentRequestStatus = requests.value.map(
    ({ teamId, status }) => teamId === id && status,
  )

  return formatDataButtonByStatus(currentRequestStatus).variant
}

function getTextRequest(team: Team) {
  const { id } = team
  const currentRequestStatus = requests.value.map(
    ({ teamId, status }) => teamId === id && status,
  )

  return formatDataButtonByStatus(currentRequestStatus).text
}

function getDisabledRequest(team: Team) {
  const { id } = team
  const currentRequestStatus = requests.value.map(
    ({ teamId, status }) => teamId === id && status,
  )

  return (
    currentRequestStatus.includes('CANCELED') ||
    currentRequestStatus.includes('ANNULLED')
  )
}

function accessCollapseOpen(team: Team) {
  const { id } = team
  const currentRequestStatus = requests.value.map(
    ({ teamId, status }) => teamId === id && status,
  )

  return !currentRequestStatus.includes('NEW')
}

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
          @click="navigateToTeamProfile(team)"
        >
          {{ team.name }}
        </Button>

        <Button
          v-if="accessCollapseOpen(team)"
          :variant="getStyleRequest(team)"
          :disabled="getDisabledRequest(team)"
          v-collapse="team.id"
          @click="takeTeamData(team.id)"
        >
          {{ getTextRequest(team) }}
        </Button>

        <Button
          v-else
          variant="danger"
          @click="openConfirmModal(team)"
        >
          Отозвать заявку
        </Button>
      </div>

      <Collapse :id="team.id">
        <div class="team-request-collapse__info py-1">
          <div class="w-100 d-flex p-2">
            <div class="w-50">
              <div class="d-flex align-items-center text-primary pb-1">Состав:</div>
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
                  v-if="isDisabledButtonSkills"
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
            label="Мотивационное письмо"
            :hint="hintLetter"
          />

          <Button
            class-name="btn-success"
            v-collapse="team.id"
            @click="sendRequestTeam()"
          >
            Подать заявку
          </Button>
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
