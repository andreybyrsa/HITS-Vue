<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useDateFormat, useToggle } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import InvitationsTableProps from '@Components/Modals/TeamModal/InvitationsTable.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'

import { TeamInvitation } from '@Domain/TeamInvitation'

import useUserStore from '@Store/user/userStore'

import TeamService from '@Services/TeamService'

defineProps<InvitationsTableProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()

const [isSorted, setIsSorted] = useToggle(true)

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function sortDate(date: TeamInvitation[]) {
  date.sort((a, b) => {
    const A = new Date(a.createdAt).getTime()
    const B = new Date(b.createdAt).getTime()
    return isSorted.value ? B - A : A - B
  })

  setIsSorted()
}

const handleDeleteTeamInvitation = async (invitationId: number) => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.deleteInvitation(invitationId, token)

    if (response instanceof Error) {
      return
    }
  }
}
</script>
<template>
  <div class="bg-light rounded-3 border border-primary overflow-y-scroll">
    <span class="d-flex justify-content-between p-2 w-100 text-white bg-primary"
      ><Typography>Получатель</Typography>
      <Typography>Отправитель</Typography>
      <Typography
        class="text-white button"
        @click="sortDate(invitations)"
        >Дата подачи</Typography
      >
      <Typography class-name="px-3">Действие</Typography></span
    >
    <span
      class="d-flex justify-content-between p-2 w-100 border border-secondary"
      v-for="invitation in invitations"
      :key="invitation.id"
    >
      <Typography class-name="py-2">{{ invitation.userEmail }}</Typography>
      <Button @click="router.push(`profile/${invitation.inviter.email}`)">
        {{ invitation.inviter.firstName }}
        {{ invitation.inviter.lastName }}</Button
      >

      <Typography class-name="py-2">{{
        getFormattedDate(invitation.createdAt.toDateString())
      }}</Typography>
      <Button
        class="text-start rounded-3 bg-danger text-white"
        @click="handleDeleteTeamInvitation(invitation.id)"
      >
        Удалить
      </Button>
    </span>
  </div>
</template>
<style lang="scss" scoped>
.button {
  cursor: pointer;
}
</style>
