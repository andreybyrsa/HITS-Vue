<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { Team } from '@Domain'
import { useUserStore } from '@Store'
import { RequestToIdeaFormProps } from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.types.'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import RequestTeamCollapse from '@Components/Forms/RequestToIdeaForm/RequestTeamCollapse.vue'

const userStore = useUserStore()
const skillsAcceptedTeam = defineModel<Team>('skillsAcceptedTeam')
const router = useRouter()

defineProps<RequestToIdeaFormProps>()

function navigateToTeamForm() {
  userStore.setRole('TEAM_OWNER')
  router.push('/teams/create')
}
</script>

<template>
  <div
    v-if="ownerTeams.length === 0"
    class="d-flex bg-white rounded p-2 w-100 px-3 align-items-center justify-content-between"
  >
    <Typography class-name="text-danger"> *У вас нет команд </Typography>
    <Button
      variant="primary"
      @click="navigateToTeamForm"
    >
      Создать команду?
    </Button>
  </div>

  <div
    v-else
    class="w-100 d-flex flex-column bg-white rounded-3"
  >
    <Typography class-name="fs-6 py-2 px-3 border-bottom"> Ваши команды </Typography>
    <div class="d-flex flex-column gap-2 p-3">
      <RequestTeamCollapse
        v-for="(team, index) in ownerTeams"
        :key="index"
        :team="team"
        :idea="ideaMarket"
        v-model:skillsAcceptedTeam="skillsAcceptedTeam"
        :isDisabledButtonSkills="$route.name === 'market-idea-modal'"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.request-form {
  @include flexible(flex-start, flex-start);
  width: 100%;
}
</style>
