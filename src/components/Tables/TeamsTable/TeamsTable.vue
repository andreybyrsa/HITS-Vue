<template>
  <Table
    :columns="teamTableColumns"
    :data="teams"
    :search-by="['name']"
    :filters="teamsFilters"
    :dropdown-actions-menu="dropdownTeamsActions"
  ></Table>

  <DeleteModal
    :is-opened="isOpenedTeamDeleteModal"
    @close-modal="handleCloseDeleteModal"
    @delete="handleDeleteTeam"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, Ref } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import Table from '@Components/Table/Table.vue'
import { TableColumn, DropdownMenuAction } from '@Components/Table/Table.types'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'

import { Team } from '@Domain/Team'
import { Skill } from '@Domain/Skill'

import TeamService from '@Services/TeamService'
import SkillsService from '@Services/SkillsService'
import ProfileService from '@Services/ProfileService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { makeParallelRequests, RequestResult } from '@Utils/makeParallelRequests'
import Profile from '@Domain/Profile'

const router = useRouter()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const teams = defineModel<Team[]>({ required: true })
const skills = ref<Skill[]>([])
const profile = ref<Profile>()

const deletingTeamId = ref<string | null>(null)

const filterByIsClosed = ref<boolean>()
const filterByVacancies = ref<boolean>(false)
const filterBySkills = ref<string[]>([])

const searchBySkills = ref('')

const isSortedByMembersCount = ref(false)
const isSortedByCreatedAt = ref(false)
const isOpenedTeamDeleteModal = ref(false)

function checkResponseStatus<T>(
  data: RequestResult<T>,
  refValue: Ref<T | undefined>,
) {
  if (data.status === 'fulfilled') {
    refValue.value = data.value
  } else {
    notificationsStore.createSystemNotification('Система', `${data.value}`)
  }
}

onMounted(async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token, email } = currentUser

    const teamsTableParallelRequests = [
      () => SkillsService.getAllSkills(token),
      () => ProfileService.getUserProfile(email, token),
    ]

    await makeParallelRequests<Profile | Skill[] | Error>(
      teamsTableParallelRequests,
    ).then((responses) => {
      responses.forEach((response) => {
        if (response.id === 0) {
          checkResponseStatus(response, skills)
        } else if (response.id === 1) {
          checkResponseStatus(response, profile)
        }
      })
    })

    const response = await SkillsService.getAllSkills(token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    skills.value = response
  }
})

const teamTableColumns: TableColumn<Team>[] = [
  {
    key: 'isClosed',
    label: 'Статус',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellStyle: getStatusStyle,
    getRowCellFormat: getTranslatedStatus,
  },
  {
    key: 'name',
    label: 'Название',
    size: 'col-3',
    rowCellClick: navigateToTeamModal,
  },
  {
    key: 'membersCount',
    label: 'Участники',
    contentClassName: 'justify-content-center align-items-center text-center',
    headerCellClick: sortByMembersCount,
  },
  {
    key: 'createdAt',
    label: 'Дата создания',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellFormat: getFormattedDate,
    headerCellClick: sortByCreatedAt,
  },
]

const dropdownTeamsActions: DropdownMenuAction<Team>[] = [
  {
    label: 'Просмотреть',
    click: navigateToTeamModal,
  },
]

const teamsFilters = computed<Filter<Team>[]>(() => [
  {
    category: 'Статус',
    choices: [
      { label: 'Открытая команда', value: false },
      { label: 'Закрытая команда', value: true },
    ],
    refValue: filterByIsClosed,
    isUniqueChoice: true,
    checkFilter: checkTeamStatus,
  },
  {
    category: 'Компетенции',
    choices: [
      { label: 'Искать везде', value: false },
      { label: 'Искать по вакансиям', value: true },
    ],
    refValue: filterByVacancies,
    isUniqueChoice: true,
    checkFilter: checkTeamVacancies,
    statement: user.value?.role !== 'INITIATOR',
  },
  {
    category: 'Стек технологий',
    choices: skills.value
      .map(({ name }) => ({
        label: name,
        value: name,
        isMarked: !!profile.value?.skills.find((skill) => skill.name === name),
      }))
      .sort((a, b) => +b.isMarked - +a.isMarked),
    refValue: filterBySkills,
    isUniqueChoice: false,
    searchValue: searchBySkills,
    checkFilter: checkTeamSkill,
  },
])

function sortByCreatedAt() {
  teams.value.sort((team1, team2) => {
    const comparingDate1 = new Date(team1.createdAt).getTime()
    const comparingDate2 = new Date(team2.createdAt).getTime()

    if (isSortedByCreatedAt.value) {
      return comparingDate1 - comparingDate2
    } else {
      return comparingDate2 - comparingDate1
    }
  })
  isSortedByCreatedAt.value = !isSortedByCreatedAt.value
}

function sortByMembersCount() {
  teams.value.sort((team1, team2) => {
    const comparingDate1 = new Date(team1.membersCount).getTime()
    const comparingDate2 = new Date(team2.membersCount).getTime()

    if (isSortedByMembersCount.value) {
      return comparingDate1 - comparingDate2
    } else {
      return comparingDate2 - comparingDate1
    }
  })
  isSortedByMembersCount.value = !isSortedByMembersCount.value
}

function getStatusStyle(isClosed: boolean) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (isClosed) {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }

  initialClass.push('bg-success-subtle', 'text-success')
  return initialClass
}

function getTranslatedStatus(isClosed: boolean) {
  return isClosed ? 'Закрыта' : 'Открыта'
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function navigateToTeamModal(team: Team) {
  router.push(`/teams/list/${team.id}`)
}

function handleCloseDeleteModal() {
  isOpenedTeamDeleteModal.value = false
}

async function handleDeleteTeam() {
  const currentUser = user.value

  if (currentUser?.token && deletingTeamId.value !== null) {
    const { token } = currentUser

    const response = await TeamService.deleteTeam(deletingTeamId.value, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const deletingTeamIndex = teams.value.findIndex(
      (team) => team.id === deletingTeamId.value,
    )

    if (deletingTeamIndex !== -1) {
      teams.value.splice(deletingTeamIndex, 1)
    }
  }
}

function checkTeamStatus(team: Team, status: FilterValue) {
  return team.isClosed === status
}

function checkTeamVacancies(team: Team, isFilteringByVacancies: FilterValue) {
  if (isFilteringByVacancies) {
    const teamSkills = team.wantedSkills
      .map(({ name }) => name)
      .filter((skillName) => !team.skills.find(({ name }) => name === skillName))

    return teamSkills.some((skillName) => filterBySkills.value.includes(skillName))
  }
  return true
}

function checkTeamSkill(team: Team, skill: FilterValue) {
  const currentUser = user.value

  if (currentUser?.role) {
    const { role } = currentUser

    if (role === 'INITIATOR') {
      return team.skills.some(({ name }) => name === skill)
    }

    return (
      team.skills.some(({ name }) => name === skill) ||
      team.wantedSkills.some(({ name }) => name === skill)
    )
  }
}
</script>
