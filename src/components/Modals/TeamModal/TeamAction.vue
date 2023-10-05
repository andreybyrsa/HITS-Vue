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
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const props = defineProps<TeamActionProps>()
const route = useRouter()

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
  console.log(teamId.value)
  route.push('/teams')
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
        user.value?.id != props.team?.leader.id) ||
      (button.name == 'Выйти из команды' &&
        props.team?.leader.id != user.value?.id &&
        props.team?.members.find((member) => member.id == user.value?.id))
    )
  }
}

function handleClick(button: TeamButtonAction, team: Team) {
  button.name == 'Удалить команду'
    ? handleOpenDeleteModal(team.id)
    : button.name == 'Пригласить в команду'
    ? handleOpenInviteModal(team.id)
    : button.name == 'Редактировать'
}
</script>
<template>
  <div
    class="team-action px-2 py-3"
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
        v-if="button.name == 'Поделиться'"
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
