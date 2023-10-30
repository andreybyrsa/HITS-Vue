<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'

import { RequestToIdeaProps } from '@Components/Forms/RequestToIdeaForm/RequestToIdeaForm.types.'

import Button from '@Components/Button/Button.vue'
import RequestYourself from '@Components/Forms/RequestToIdeaForm/RequestYourself.vue'
import RequestTeam from '@Components/Forms/RequestToIdeaForm/RequestTeam.vue'
import RequestTabs from '@Components/Forms/RequestToIdeaForm/RequestToIdeaTabs.vue'

import useUserStore from '@Store/user/userStore'
import RequestTeamsServise from '@Services/RequestTeamsServise'

import RequestTeams from '@Domain/RequestTeams'
import Team from '@Domain/Team'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

defineProps<RequestToIdeaProps>()

const route = useRoute()

const requestTeams = defineModel<RequestTeams[]>({ required: true })

const isStatementContent = ref<boolean>(false)

const { handleSubmit } = useForm({
  validationSchema: {
    letter: (value: string) => value?.length > 0 || 'Поле не заполнено',
    team: (value: Team) => value || 'Поле не выбрано',
  },
})

function filterTeamsOwner(teams: Team[]) {
  return teams.filter((elem) => elem.owner.email == user.value?.email)
}

const letter = ref<string>('')
const selectTeam = ref<Team>()

const sendRequestTeam = handleSubmit(async () => {
  const currentUser = user.value

  if (currentUser?.token && selectTeam.value) {
    const { token } = currentUser
    const { id } = route.params

    const requestTeam: RequestTeams = {
      ...selectTeam.value,

      ideaId: Number(id),
      accepted: false,
      letter: letter.value,
    }

    await RequestTeamsServise.postRequest(requestTeam, token)
    requestTeams.value.push(requestTeam)
  }
})
</script>

<template>
  <div
    v-if="user?.email != idea.initiator"
    class="request-form bg-white p-3 rounded-3"
  >
    <RequestTabs v-model="isStatementContent" />

    <RequestYourself
      v-if="isStatementContent"
      v-model="letter"
    />
    <RequestTeam
      v-else
      :teams="filterTeamsOwner(teams)"
      v-model:selectTeam="selectTeam"
      v-model:letter="letter"
    />

    <Button
      v-if="filterTeamsOwner(teams).length || isStatementContent"
      class-name="btn-success"
      @click="sendRequestTeam"
    >
      Подать заявку
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.request-form {
  @include flexible(flex-start, flex-start, column, $gap: 16px);
  width: 100%;
}
</style>
