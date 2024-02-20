<template>
  <Table
    class-name="px-3 pb-3 pt-1"
    :data="ideaMarketTeams"
    :columns="ideaMarketTeamColumns"
    :search-by="['name']"
    :dropdown-actions-menu="dropdownIdeaMarketTeamActions"
    v-model="selectedTeam"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { useRouter, RouteRecordRaw } from 'vue-router'

import Table from '@Components/Table/Table.vue'
import IdeaMarketTeamsTableProps from '@Components/Tables/IdeaMarketTeamsTable/IdeaMarketTeamsTable.types'
import { TableColumn, DropdownMenuAction } from '@Components/Table/Table.types'
import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'

import { Skill } from '@Domain/Skill'
import { Team, TeamMember } from '@Domain/Team'

import mutableSort from '@Utils/mutableSort'
import { getSkillInfoStyle } from '@Utils/skillsInfo'

const props = defineProps<IdeaMarketTeamsTableProps>()
const skillsTeam = defineModel<Team>()

const ideaMarketTeams = ref<Team[]>([])
const selectedTeam = ref<Team[]>([])

const router = useRouter()

watchImmediate(
  () => props.ideaMarket,
  (ideaMarket) => {
    if (ideaMarket.team) {
      ideaMarketTeams.value = [ideaMarket.team]
      skillsTeam.value = ideaMarket.team
    }
  },
)

const ideaMarketTeamColumns: TableColumn<Team>[] = [
  {
    key: 'name',
    label: 'Название',
    size: 'col-3',
    contentClassName: 'justify-content-start align-items-center text-center',
    rowCellClick: navigateToTeamModal,
  },
  {
    key: 'leader',
    label: 'Лидер',
    size: 'col-3',
    contentClassName: 'justify-content-start align-items-center text-center',
    rowCellClick: navigateToLeaderProfile,
    getRowCellFormat: getLeaderFormat,
    getRowCellStyle: getLeaderStyle,
  },
  {
    key: 'membersCount',
    label: 'Участники',
    contentClassName: 'justify-content-center align-items-center',
    headerCellClick: sortByMembersCount,
  },
  {
    key: 'skills',
    label: 'Кометенции',
    size: 'col-4',
    contentClassName: 'justify-content-center align-items-center',
    getRowCellStyle: getSkillsStyle,
    getRowCellFormat: getSkillsFormat,
  },
]

const dropdownIdeaMarketTeamActions: DropdownMenuAction<Team>[] = [
  {
    label: 'Профиль команды',
    click: navigateToTeamModal,
  },
]

function getSkillsFormat(skills: Skill[], index: number) {
  const currentSkill = skills[index]
  return currentSkill.name
}

function getLeaderFormat(leader: TeamMember | null) {
  if (leader) {
    return `${leader.firstName} ${leader.lastName}`
  }
}

function getSkillsStyle(skills: Skill[], index: number) {
  const { type } = skills[index]
  const skillTypeClass = getSkillInfoStyle(type)

  return ['px-2', 'py-1', 'rounded', 'd-flex', 'gap-1', ...skillTypeClass]
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
    name: 'team-modal',
    path: 'team/:teamId',
    alias: '/team/:teamId',
    meta: { from: 'market-ideas' },
    component: TeamModal,
  }

  router.addRoute('market-ideas', teamModalRoute)
  router.push({ path: `/team/${team.id}` })
}

function navigateToLeaderProfile(team: Team) {
  const teamLeader = team.leader

  if (teamLeader) {
    const leaderModalRoute: RouteRecordRaw = {
      name: 'profile',
      path: 'profile/:id',
      alias: '/profile/:id',
      component: ProfileModal,
      props: {
        canGoBack: true,
      },
    }

    router.addRoute('market-ideas', leaderModalRoute)
    router.push({ path: `/profile/${teamLeader.id}` })
  }
}
</script>
