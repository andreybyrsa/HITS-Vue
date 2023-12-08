<template>
  <Table
    :data="ideaMarketTeams"
    :columns="ideaMarketTeamColumns"
    :search-by="['name']"
    :dropdown-actions-menu="dropdownIdeaMarketTeamActions"
  />

  <ConfirmModal
    :is-opened="isOpenedConfirmModal"
    text-button="Исключить"
    text-question="Вы действительно исключить команду?"
    @close-modal="closeConfirmModal"
    @action="kickTeamFromIdeaMarket"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { useRouter, RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'

import Table from '@Components/Table/Table.vue'
import IdeaMarketTeamsTableProps from '@Components/Tables/IdeaMarketTeamsTable/IdeaMarketTeamsTable.types'
import { TableColumn, DropdownMenuAction } from '@Components/Table/Table.types'
import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'
import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'

import { Team, TeamMember } from '@Domain/Team'

import useUserStore from '@Store/user/userStore'
import useIdeasMarketStore from '@Store/ideasMarket/ideasMarket'

import mutableSort from '@Utils/mutableSort'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'

const props = defineProps<IdeaMarketTeamsTableProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasMarketStore = useIdeasMarketStore()

const ideaMarketTeams = ref<Team[]>([])
const currentIdeaMarketTeam = ref<Team | null>(null)

const router = useRouter()

const isOpenedConfirmModal = ref(false)

watchImmediate(
  () => props.ideaMarket,
  (ideaMarket) => {
    if (ideaMarket.team) {
      ideaMarketTeams.value = [ideaMarket.team]
    }
  },
)

const ideaMarketTeamColumns: TableColumn<Team>[] = [
  {
    key: 'name',
    label: 'Название',
    size: 'col-3',
    contentClassName: 'justify-content-center align-items-center text-center',
    rowCellClick: navigateToTeamModal,
  },
  {
    key: 'leader',
    label: 'Лидер',
    size: 'col-3',
    contentClassName: 'justify-content-center align-items-center text-center',
    rowCellClick: navigateToLeaderProfile,
    getRowCellFormat: getLeaderFormat,
    getRowCellStyle: getLeaderStyle,
  },
  {
    key: 'membersCount',
    label: 'Участники',
    size: 'col-1',
    contentClassName: 'justify-content-center align-items-center text-center',
    headerCellClick: sortByMembersCount,
  },
  // skills ?
]

const dropdownIdeaMarketTeamActions: DropdownMenuAction<Team>[] = [
  {
    label: 'Профиль команды',
    click: navigateToTeamModal,
  },

  {
    label: 'Исключить',
    className: 'text-danger',
    click: openConfirmModal,
  },
]

function getLeaderFormat(leader: TeamMember | null) {
  if (leader) {
    return `${leader.firstName} ${leader.lastName}`
  }
}

function getLeaderStyle(leader: TeamMember | null) {
  if (leader) {
    return 'text-warning'
  }
}

function sortByMembersCount() {
  mutableSort(
    ideaMarketTeams.value,
    (ideaMarketTeam: Team) => ideaMarketTeam.membersCount,
  )
}

function navigateToTeamModal(team: Team) {
  const teamModalRoute: RouteRecordRaw = {
    name: 'teams',
    path: 'teams/:id',
    alias: '/teams/:id',
    component: TeamModal,
  }

  router.addRoute('market', teamModalRoute)
  router.push({ path: `/market/${team.id}` })
}

function navigateToLeaderProfile(team: Team) {
  const teamLeader = team.leader

  if (teamLeader) {
    const leaderModalRoute: RouteRecordRaw = {
      name: 'teams',
      path: 'teams/:id',
      alias: '/teams/:id',
      component: ProfileModal,
      props: {
        canGoBack: true,
      },
    }

    router.addRoute('market', leaderModalRoute)
    router.push({ path: `/market/${teamLeader.id}` })
  }
}

function openConfirmModal(team: Team) {
  currentIdeaMarketTeam.value = team
  isOpenedConfirmModal.value = true
}
function closeConfirmModal() {
  currentIdeaMarketTeam.value = null
  isOpenedConfirmModal.value = false
}

async function kickTeamFromIdeaMarket() {
  const currentUser = user.value

  if (currentUser?.token && currentIdeaMarketTeam.value) {
    const { token } = currentUser
    const { id } = props.ideaMarket

    await ideasMarketStore.kickTeamFromIdeaMarket(
      id,
      currentIdeaMarketTeam.value,
      token,
    )
  }
}
</script>
