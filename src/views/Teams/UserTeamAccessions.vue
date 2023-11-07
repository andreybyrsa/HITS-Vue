<script lang="ts" setup>
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import { TableColumn } from '@Components/Table/Table.types'
import TeamAccessionsTable from '@Components/Tables/TeamAccessionsTable/TeamAccessionsTable.vue'
import Typography from '@Components/Typography/Typography.vue'

import Team from '@Domain/Team'
import { TeamAccession, accessionStage } from '@Domain/TeamAccession'
import TeamMember from '@Domain/TeamMember'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'

import TeamService from '@Services/TeamService'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import useUserStore from '@Store/user/userStore'

import mutableSort from '@Utils/mutableSort'

import { useDateFormat } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const notificationStore = useNotificationsStore()

const router = useRouter()

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const allAccessions = ref<TeamAccession[]>()

onMounted(async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { email, token } = currentUser

    const response = await TeamService.getUserTeamAccessions(email, token)

    if (response instanceof Error) {
      return notificationStore.createSystemNotification('Система', response.message)
    }

    allAccessions.value = response
  }
})

const columns: TableColumn<TeamAccession>[] = [
  {
    key: 'team',
    label: 'Команда',
    getRowCellFormat: getTeamFormat,
    rowCellClick: navigateToTheTeam,
  },
  {
    key: 'stage',
    label: 'Этап',
    getRowCellFormat: getStatusFormat,
    getRowCellStyle: getStageStyle,
  },
  {
    key: 'inviter',
    label: 'Отправитель приглашения',
    getRowCellFormat: getInviterFormat,
    rowCellClick: navigateToInviterProfile,
  },
  {
    key: 'updatedAt',
    label: 'Последнее обновление',
    getRowCellFormat: getFormattedDate,
    headerCellClick: sortByUpdatedAt,
  },
]

function getTeamFormat(team: Team) {
  return team.name
}

function navigateToTheTeam(teamAccession: TeamAccession) {
  router.push(`accessions/${teamAccession.team.id}`)
}

function getStatusFormat(stage: accessionStage) {
  return stage == 'INVITATION'
    ? 'Приглашение'
    : stage == 'REQUEST'
    ? 'Заявка'
    : stage == 'ACCEPTED'
    ? 'Принято'
    : 'Отклонено'
}

function getStageStyle(stage: accessionStage) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (stage === 'INVITATION') {
    initialClass.push('bg-primary-subtle', 'text-primary')
    return initialClass
  }

  if (stage === 'REQUEST' || status === 'ON_APPROVAL') {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }

  if (stage === 'REJECTED') {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }

  if (stage === 'ACCEPTED') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }
}

function getInviterFormat(inviter?: TeamMember) {
  if (inviter) {
    return inviter.firstName + ' ' + inviter.lastName
  }
  return ''
}

function navigateToInviterProfile(teamAccession: TeamAccession) {
  if (teamAccession.inviter) {
    router.push(`profile/${teamAccession.inviter.id}`)
  }
}

function getFormattedDate(date: string) {
  const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
  return formattedDate.value
}

function sortByUpdatedAt() {
  if (allAccessions.value) {
    mutableSort(allAccessions.value, (teamAccession: TeamAccession) =>
      new Date(teamAccession.updatedAt).getTime(),
    )
  }
}
</script>

<template>
  <PageLayout content-class-name="accessions-page__content p-3 bg-white">
    <template #leftSideBar>
      <LeftSideBar />
    </template>

    <template #content>
      <Typography class-name="accessions-page__header fs-2 text-primary"
        >Мои заявки и пришлашения</Typography
      >
      <TeamAccessionsTable
        v-model="allAccessions"
        :columns="columns"
      />
    </template>
  </PageLayout>
</template>

<style lang="scss" scoped>
.accessions-page {
  &__header {
    @include flexible(center, space-between);
  }

  &__content {
    @include flexible(stretch, flex-start, column);
  }
}
</style>
