<template>
  <Table
    :data="profile?.teams ?? []"
    :columns="teamExperienceColumns"
    :search-by="['teamName']"
    :dropdown-actions-menu="dropdownTeamsActions"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { RouteRecordRaw, useRoute } from 'vue-router'

import Table from '@Components/Table/Table.vue'
import { TableColumn, DropdownMenuAction } from '@Components/Table/Table.types'
import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'

import { TeamExperience } from '@Domain/Team'

import useProfilesStore from '@Store/profiles/profilesStore'

import navigateToAliasRoute from '@Utils/navigateToAliasRoute'

const route = useRoute()
const profileId = route.params.id.toString()

const profilesStore = useProfilesStore()
const profile = computed(() => profilesStore.getProfileByUserId(profileId))

const teamExperienceColumns: TableColumn<TeamExperience>[] = [
  {
    key: 'teamName',
    label: 'Команда',
    rowCellClick: navigateToTeamModal,
  },
  {
    key: 'startDate',
    label: 'Дата вступления',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
  },
  {
    key: 'finishDate',
    label: 'Дата исключения',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
    getRowCellStyle: getStyleDate,
  },
  {
    key: 'hasActiveProject',
    label: 'Статус',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getTranslatedWorkStatus,
    getRowCellStyle: getStatusWorkStyle,
  },
]

const dropdownTeamsActions = computed<DropdownMenuAction<TeamExperience>[]>(() => [
  {
    label: 'Просмотреть',
    click: navigateToTeamModal,
  },
])

function navigateToTeamModal(experience: TeamExperience) {
  const nestedRouteName = route.matched[route.matched.length - 2].name?.toString()
  const ideaModalRoute: RouteRecordRaw = {
    name: 'team-modal',
    path: 'team/:teamId',
    alias: '/team/:teamId',
    component: TeamModal,
    meta: { from: nestedRouteName },
    props: {
      canGoBack: true,
    },
  }

  if (nestedRouteName) {
    navigateToAliasRoute(
      nestedRouteName,
      `/team/${experience.teamId}`,
      ideaModalRoute,
    )
  }
}

function getStyleDate(date: string) {
  if (!date) {
    return ['text-primary']
  }
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
  return 'В команде'
}

function getTranslatedWorkStatus(workStatus: boolean) {
  return workStatus ? 'В работе' : 'В поисках'
}

function getStatusWorkStyle(workStatus: boolean) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (workStatus) {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }

  initialClass.push('bg-primary-subtle', 'text-primary')
  return initialClass
}
</script>
