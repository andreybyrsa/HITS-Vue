<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useFieldArray, useForm } from 'vee-validate'

import { RequestToIdeaProps } from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.types.'

import Button from '@Components/Button/Button.vue'
import RequestYourself from '@Components/Forms/RequestToIdeaForm/RequestYourself.vue'
import RequestTeam from '@Components/Forms/RequestToIdeaForm/RequestTeam.vue'
import RequestTabs from '@Components/Forms/RequestToIdeaForm/RequestToIdeaTabs.vue'
import RequestTeamCollapse from '@Components/Forms/RequestToIdeaForm/RequestTeamCollapse.vue'
import useUserStore from '@Store/user/userStore'
import RequestTeamsServise from '@Services/RequestTeamsServise'

import RequestTeams from '@Domain/RequestTeams'
import Team from '@Domain/Team'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const props = defineProps<RequestToIdeaProps>()

const route = useRoute()
const router = useRouter()

const requestTeams = defineModel<RequestTeams[]>('requestTeams', { required: true })
const teams = defineModel<Team[]>('teams', { required: true })

const { handleSubmit } = useForm({
  validationSchema: {
    letter: (value: string) => value?.length > 0 || 'Поле не заполнено',
  },
})

const letterTeam = ref<string>('')
const selectTeam = ref<Team>()

function filterTeamOwner() {
  return teams.value.filter((team) => team.owner.email == user.value?.email)
}

function sendOnPageCreateTeam() {
  router.push('/teams/create')
}
</script>

<template>
  <div
    v-if="user?.email != idea.initiator"
    class="request-form bg-white p-3 rounded-3"
  >
    <RequestTeamCollapse
      v-for="(team, index) in filterTeamOwner()"
      :key="index"
      :team="team"
      v-model:teams="teams"
      v-model:requestTeams="requestTeams"
    />

    <div
      v-if="filterTeamOwner().length == 0"
      class="team-request-collapse__button w-100"
    >
      <span class="text-danger">*Вы не являетесь владельцем команды.</span>
      <Button
        class-name="btn-primary"
        @click="sendOnPageCreateTeam"
      >
        Создать команду?
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.request-form {
  @include flexible(flex-start, flex-start, column, $gap: 16px);
  width: 100%;
}
</style>
