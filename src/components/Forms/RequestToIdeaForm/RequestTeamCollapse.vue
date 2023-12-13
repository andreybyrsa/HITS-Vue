<script lang="ts" setup>
import { ref } from 'vue'
import { RouteRecordRaw, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import { RequestTeamCollapseProps } from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.types.'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Typography from '@Components/Typography/Typography.vue'
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

const props = defineProps<RequestTeamCollapseProps>()

const notificationsStore = useNotificationsStore()
const requestToIdeaStore = useRequestsToIdeaStore()

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const currentTeam = ref<Team>()

const requestTeams = defineModel<RequestTeamToIdea[]>('requestTeams', {
  required: true,
})

const letter = ref<string>('')

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

const { handleSubmit } = useForm({
  validationSchema: {
    letter: (value: string) => value?.length > 0 || 'Поле не заполнено',
  },
  initialValues: {
    letter: '',
  },
})

const sendRequestTeam = handleSubmit(async () => {
  const currentUser = user.value

  if (currentUser?.token && currentTeam.value) {
    const { token } = currentUser
    const id = props.idea.id

    requestToIdeaStore.postRequest(currentTeam.value, id, letter.value, token)
  }
})

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

function checkSendTeamRequest() {
  return requestTeams.value?.filter((team) => team.teamId == props.team.id)
}

function checkTeamRequest(teamProps: Team) {
  return requestTeams.value?.find((team) => team.teamId == teamProps.id)
}

const isOpenedConfirmModal = ref<boolean>(false)
const currentTeamForChangeStatus = ref<RequestTeamToIdea>()

function openConfirmModal(team: RequestTeamToIdea) {
  currentTeamForChangeStatus.value = team
  isOpenedConfirmModal.value = true
}

function closeConfirmModal() {
  isOpenedConfirmModal.value = false
}

const cancelRequestToTeam = async () => {
  const currentUser = user.value

  if (currentUser?.token && currentTeamForChangeStatus.value) {
    const { token } = currentUser

    await requestToIdeaStore.cancelRequestToIdea(
      currentTeamForChangeStatus.value,
      token,
    )
  }
}

function getTextStatusRequest(team: RequestTeamToIdea) {
  if (team.status === 'ACCEPTED') {
    return 'Заявка принята'
  }
  if (team.status === 'CANCELED') {
    return 'Заявка отклонена'
  }
}

function getStyleStatusRequest(team: RequestTeamToIdea) {
  if (team.status === 'ACCEPTED') {
    return 'success'
  }
  if (team.status === 'CANCELED') {
    return 'danger'
  }
}
</script>

<template>
  <router-view />
  <div
    v-if="!checkTeamRequest(team)"
    class="team-request-collapse w-100"
  >
    <div class="border rounded-3 py-1 px-2 overflow-hidden w-100">
      <div class="team-request-collapse__button">
        <Button
          class-name="btn-link"
          @click="navigateToUserProfile(team)"
        >
          {{ team.name }}
        </Button>
        <Button
          class-name="btn-primary"
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
                  v-model="team.skills"
                />
                <div>Компетенции:</div>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <Skills :skills="currentTeam?.skills" />
              </div>
            </div>
          </div>

          <Typography class-name="border-bottom fs-6 text-secondary w-100">
            Мотивационное письмо
          </Typography>
          <Textarea
            class-name="team-request-collapse__letter w-100 rounded-end"
            name="letter"
            v-model="letter"
          />

          <div class="d-flex gap-2">
            <Button
              class-name="btn-success"
              @click="sendRequestTeam()"
            >
              Подать заявку
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  </div>

  <div
    v-else
    v-for="(team, index) in checkSendTeamRequest()"
    :key="index"
    class="team-request-collapse__button py-1 px-2 border rounded w-100"
  >
    <Button
      class-name="btn-link"
      @click="navigateToUserProfile(team)"
    >
      {{ team.name }}
    </Button>
    <Button
      :variant="team.status !== 'NEW' ? getStyleStatusRequest(team) : 'danger'"
      @click="openConfirmModal(team)"
      :disabled="team.status !== 'NEW'"
    >
      {{ team.status !== 'NEW' ? getTextStatusRequest(team) : 'Отклонить заявку' }}
    </Button>
  </div>

  <ConfirmModal
    :is-opened="isOpenedConfirmModal"
    text-button="Отклонить заявку"
    text-question="Вы действительно хотите отклонить заявку?"
    @close-modal="closeConfirmModal"
    @action="cancelRequestToTeam"
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
