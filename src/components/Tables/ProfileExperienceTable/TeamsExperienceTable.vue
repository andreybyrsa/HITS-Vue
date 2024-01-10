<template>
  <Table
    v-if="profile"
    class-name="p-3"
    :columns="usersTableColumns"
    :data="teamsExperience"
    :search-by="['teamName']"
    :dropdown-actions-menu="dropdownUsersActions"
  />

  <ProjectExprienceModal
    :is-opened="isOpenedExprienceModal"
    :team-project="currentTeamProjects"
    :team-name="teamName"
    @close-modal="closeExprienceModal"
  />
</template>

<script lang="ts" setup>
import { useDateFormat, watchImmediate } from '@vueuse/core'
import { ref } from 'vue'
import { RouteRecordRaw, useRoute } from 'vue-router'

import { DropdownMenuAction, TableColumn } from '@Components/Table/Table.types'
import Table from '@Components/Table/Table.vue'

import { TeamsExperience } from '@Components/Tables/ProfileExperienceTable/ProfileExperience.types'
import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'
import ProjectExprienceModal from '@Components/Modals/ProjectExperienceModal/ProjectExperienceModal.vue'

import { TeamExperience } from '@Domain/Team'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'
import { ProjectMember } from '@Domain/Project'

const route = useRoute()

const props = defineProps<TeamsExperience>()

const teamsExperience = ref<TeamExperience[]>([])
const teamName = ref('')

const isOpenedExprienceModal = ref(false)
const currentTeamProjects = ref<ProjectMember[]>([])

watchImmediate(
  () => props.profile.teamsExperience,
  () => {
    if (props.profile) teamsExperience.value = props.profile.teamsExperience
  },
)

const usersTableColumns: TableColumn<TeamExperience>[] = [
  {
    key: 'teamName',
    label: 'Команда',
    size: 'col-4',
    rowCellClick: navigateToTeamModal,
  },
  {
    key: 'startDate',
    label: 'Дата вступления',
    getRowCellFormat: getFormattedDate,
    contentClassName: 'justify-content-center align-items-center text-center',
  },
  {
    key: 'finishDate',
    label: 'Дата исключения',
    getRowCellFormat: getFormattedDate,
    getRowCellStyle: getFinishDateStyle,
    contentClassName: 'justify-content-center align-items-center text-center',
  },
]

const dropdownUsersActions: DropdownMenuAction<TeamExperience>[] = [
  {
    label: 'Перейти на профиль',
    click: navigateToTeamModal,
  },
  {
    label: 'Проекты',
    click: openExprienceModal,
  },
]

function openExprienceModal(team: TeamExperience) {
  isOpenedExprienceModal.value = true
  teamName.value = team.teamName
  currentTeamProjects.value = props.profile.teamsProjects.filter(
    ({ teamId }) => teamId === team.teamId,
  )
}

function closeExprienceModal() {
  isOpenedExprienceModal.value = false
  teamName.value = ''
  currentTeamProjects.value = []
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  } else return 'В команде'
}

function getFinishDateStyle(finishDate: string) {
  const initialStyle = ['']
  if (!finishDate) {
    initialStyle.push('text-primary')
    return initialStyle
  }
}

function navigateToTeamModal(team: TeamExperience) {
  const { teamId } = team
  const nestedRouteName = route.matched[route.matched.length - 2].name?.toString()

  const teamModalRoute: RouteRecordRaw = {
    name: 'team-modal',
    path: 'team/modal/:teamId',
    alias: '/team/modal/:teamId',
    component: TeamModal,
    props: {
      canGoBack: true,
    },
  }

  if (nestedRouteName)
    navigateToAliasRoute(nestedRouteName, `/team/modal/${teamId}`, teamModalRoute)
}
</script>
