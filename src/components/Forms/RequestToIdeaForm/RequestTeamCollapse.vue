<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import { RequestTeamCollapseProps } from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.types.'

import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Typography from '@Components/Typography/Typography.vue'
import Skills from '@Components/Skills/Skills.vue'

import useUserStore from '@Store/user/userStore'
import RequestTeamsServise from '@Services/RequestTeamsServise'

import Team from '@Domain/Team'
import RequestTeams from '@Domain/RequestTeams'
import IdeasMarket from '@Domain/IdeasMarket'

const props = defineProps<RequestTeamCollapseProps>()

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const requestTeams = defineModel<RequestTeams[]>('requestTeams', { required: true })
const skillsTeam = defineModel<Team[]>('skillsTeam', { required: true })

const letter = ref<string>('')

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

  if (currentUser?.token) {
    const { token } = currentUser
    const id = props.idea.id

    const requestTeam: RequestTeams = {
      ...props.team,

      teamId: props.team.id,
      ideaId: id,
      accepted: false,
      letter: letter.value,
    }

    console.log(requestTeam)

    const response = await RequestTeamsServise.postRequest(requestTeam, token)

    if (response instanceof Error) {
      return
    }

    requestTeams.value?.push(response)
  }
})

function checkSendTeamRequest() {
  return requestTeams.value?.filter((team) => team.teamId == props.team.id)
}

function checkTeamRequest(teamProps: Team) {
  return requestTeams.value?.find((team) => team.teamId == teamProps.id)
}

function navigateToTeamModal(team: Team, idea: IdeasMarket) {
  return router.push(`/market/${idea.id}/${team.id}`)
}

function compareSkills(team: Team) {
  skillsTeam.value = [team]
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
          @click="navigateToTeamModal(team, idea)"
        >
          {{ team.name }}
        </Button>
        <Button
          class-name="btn-primary"
          v-collapse="team.id"
        >
          Заполнить заявку
        </Button>
      </div>

      <Collapse :id="+team.id">
        <div class="team-request-collapse__info py-1">
          <div class="w-100 d-flex p-2">
            <div class="w-50">
              <div class="d-flex align-items-center text-primary pb-1">
                <div>Состав:</div>
                <Button
                  class-name="btn-link"
                  @click="navigateToTeamModal(team, idea)"
                  v-if="!isDisabledButtonSkills"
                >
                  Профиль
                </Button>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <div
                  class="p-1 rounded bg-light border"
                  v-for="(member, index) in team.members"
                  :key="index"
                >
                  {{ member.firstName }} {{ member.lastName }}
                </div>
              </div>
            </div>
            <div class="w-50 border-start ps-3 pb-1">
              <div class="d-flex align-items-center text-primary pb-1">
                <div>Компетенции:</div>
                <Button
                  v-if="!isDisabledButtonSkills"
                  class-name="btn-link"
                  @click="compareSkills(team)"
                >
                  Cравнить
                </Button>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <Skills :skills="team.skills" />
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
    <Button class-name="btn-link">
      {{ team.name }}
    </Button>
    <Button
      class-name="btn-secondary"
      disabled
    >
      Заявка подана
    </Button>
  </div>
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
