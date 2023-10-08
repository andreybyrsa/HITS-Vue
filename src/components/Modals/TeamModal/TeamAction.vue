<script lang="ts" setup>
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import {
  TeamActionProps,
  TeamButtonAction,
  teamButtons,
} from '@Components/Modals/TeamModal/TeamAction.types'
import Button from '@Components/Button/Button.vue'
import { ref } from 'vue'
import DeleteModal from '../DeleteModal/DeleteModal.vue'
import Team from '@Domain/Team'
import { useRouter } from 'vue-router'
import InviteModal from '../InviteModal/InviteModal.vue'
import TeamService from '@Services/TeamService'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { deleteTeam } = TeamService
const props = defineProps<TeamActionProps>()
const router = useRouter()

const disabled = ref<boolean>(false)

const teamId = ref<string>('')
const isOpenedTeamDeleteModal = ref(false)
const isOpenedInviteModal = ref(false)

function handleCloseDeleteModal() {
  isOpenedTeamDeleteModal.value = false
}
function handleOpenDeleteModal(id: string) {
  teamId.value = id
  isOpenedTeamDeleteModal.value = true
}

function handleCloseInviteModal() {
  isOpenedInviteModal.value = false
}
function handleOpenInviteModal(id: string) {
  isOpenedInviteModal.value = true
  teamId.value = id
}

function shareButton(id: string) {
  navigator.clipboard.writeText('http://localhost:8080/team/' + id)
  disabled.value = true
}

async function handleDeleteTeam() {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    await deleteTeam(teamId.value, token)
    router.push('/teams/list')
  }
}
async function handleInvitePerson(email: string) {
  console.log(email, teamId)
}
function checkButton(button: TeamButtonAction) {
  if (user.value) {
    return (
      ((button.name == 'Редактировать' || button.name == 'Удалить команду') &&
        user.value?.id == props.team?.owner.id) ||
      (button.name == 'Пригласить в команду' &&
        (user.value?.id == props.team?.owner.id ||
          user.value?.id == props.team?.leader.id)) ||
      (button.name == 'Подать заявку на вступление' &&
        !props.team?.members.find((member) => member.id == user.value?.id) &&
        user.value?.id != props.team?.owner.id &&
        user.value?.id != props.team?.leader.id &&
        !props.team?.isClosed) ||
      (button.name == 'Подать заявку на выход' &&
        props.team?.owner.id != user.value?.id &&
        props.team?.members.find((member) => member.id == user.value?.id)) ||
      (button.name == 'Расмотреть заявки' &&
        (user.value.id == props.team?.owner.id ||
          user.value.id == props.team?.leader.id))
    )
  }
}

function handleClick(button: TeamButtonAction, team: Team) {
  button.name == 'Удалить команду'
    ? handleOpenDeleteModal(team.id)
    : button.name == 'Пригласить в команду'
    ? handleOpenInviteModal(team.id)
    : button.name == 'Редактировать'
    ? router.push(`/teams/edit/${team.id}`)
    : button.name == 'df'
}
</script>
<template>
  <div
    class="team-action"
    v-if="team"
  >
    <template
      v-for="button in teamButtons"
      :key="button.id"
    >
      <Button
        :class-name="button.buttonClass + ' w-100'"
        v-if="checkButton(button)"
        @click="handleClick(button, team)"
        >{{ button.name }}</Button
      >
      <Button
        v-if="button.name == 'Скопировать ссылку'"
        :class-name="button.buttonClass + ' w-100'"
        @click="shareButton(team?.id)"
        :disabled="disabled"
        >{{ disabled ? 'Ссылка скопирована!' : button.name }}</Button
      >
    </template>

    <DeleteModal
      v-if="user"
      :is-opened="isOpenedTeamDeleteModal"
      @close-modal="handleCloseDeleteModal"
      @delete="handleDeleteTeam()"
    />
    <InviteModal
      v-if="user"
      :is-opened="isOpenedInviteModal"
      @close-modal="handleCloseInviteModal"
      @invite="handleInvitePerson"
    />
  </div>
</template>
<style lang="scss" scoped>
.team-action {
  @include flexible(flex-start, flex-start, column, $gap: 16px);
}
</style>
