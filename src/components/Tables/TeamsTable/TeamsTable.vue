<template>
  <Table
    class-name="p-3"
    :header="teamsTableHeader"
    :columns="teamTableColumns"
    :data="teams"
    :search-by="['name', 'description']"
    :filters="teamsFilters"
    :dropdown-actions-menu="dropdownTeamsActions"
  />

  <DeleteModal
    :is-opened="isOpenedTeamDeleteModal"
    :item-name="deletingTeamName?.toString()"
    @close-modal="handleCloseDeleteModal"
    @delete="handleDeleteTeam"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import Table from '@Components/Table/Table.vue'
import {
  TableColumn,
  DropdownMenuAction,
  TableHeader,
} from '@Components/Table/Table.types'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'

import { Team } from '@Domain/Team'
import { Skill } from '@Domain/Skill'
import { Profile } from '@Domain/Profile'

import SkillsService from '@Services/SkillsService'
import ProfileService from '@Services/ProfileService'
import TeamService from '@Services/TeamService'

import useUserStore from '@Store/user/userStore'
import useTeamStore from '@Store/teams/teamsStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import {
  sendParallelRequests,
  RequestConfig,
  openErrorNotification,
} from '@Utils/sendParallelRequests'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const teamsStore = useTeamStore()

const notificationsStore = useNotificationsStore()

const router = useRouter()

const teams = defineModel<Team[]>({ required: true })
const skills = ref<Skill[]>([])
const profile = ref<Profile>()

const deletingTeamId = ref<string | null>(null)
const deletingTeamName = ref<string>()

const filterByIsClosed = ref<boolean>()
const filterByOwnerTeams = ref<string>()
const filterByVacancies = ref<boolean>(false)
const filterBySkills = ref<string[]>([])

const searchBySkills = ref('')

const isSortedByMembersCount = ref(false)
const isSortedByCreatedAt = ref(false)
const isOpenedTeamDeleteModal = ref(false)

onMounted(async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token, id } = currentUser

    const teamsTableParallelRequests: RequestConfig[] = [
      {
        request: () => SkillsService.getAllSkills(token),
        refValue: skills,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => ProfileService.getUserProfile(id, token),
        refValue: profile,
        onErrorFunc: openErrorNotification,
      },
    ]

    await sendParallelRequests(teamsTableParallelRequests)
  }
})

const teamsTableHeader = computed<TableHeader>(() => ({
  label: 'Список команд',
  countData: true,
  buttons: [
    {
      label: 'Создать команду',
      variant: 'primary',
      prependIconName: 'bi bi-plus-lg',
      click: navigateToCreateTeamForm,
      statement: checkCreateTeamButton(),
    },
  ],
}))

const teamTableColumns: TableColumn<Team>[] = [
  {
    key: 'closed',
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
  {
    label: 'Редактировать',
    statement: checkUpdateTeamAction,
    click: navigateToUpdateTeamForm,
  },
  {
    label: 'Удалить',
    className: 'text-danger',
    statement: checkDeleteTeamAction,
    click: handleOpenDeleteModal,
  },
]

const teamsFilters = computed<Filter<Team>[]>(() => [
  {
    category: 'Владелец команды',
    choices: [{ label: 'Мои команды', value: user.value?.id ?? '' }],
    refValue: filterByOwnerTeams,
    isUniqueChoice: true,
    checkFilter: checkOwnerTeams,
    statement: computed(() => user.value?.role === 'TEAM_OWNER'),
  },
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
    checkFilter: () => true,
    statement: computed(() => user.value?.role !== 'INITIATOR'),
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
    checkFilter: () => true,
  },
])

watch(
  filterBySkills,
  async () => {
    const currentUser = user.value

    const checkedSkills = getCheckedSkills()

    if (currentUser?.token && currentUser.role) {
      if (checkedSkills.length && currentUser.role) {
        const { token, role } = currentUser

        const response = await TeamService.filterBySkillsAndRole(
          checkedSkills,
          role,
          token,
        )

        if (response instanceof Error) {
          return notificationsStore.createSystemNotification(
            'Система',
            response.message,
          )
        }

        teams.value = response
      } else {
        const { token } = currentUser

        const response = await TeamService.getTeams(token)

        if (response instanceof Error) {
          return notificationsStore.createSystemNotification(
            'Система',
            response.message,
          )
        }

        teams.value = response
      }
    }
  },
  { deep: true },
)

watch(filterByVacancies, async (isVacancies) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const checkedSkills = getCheckedSkills()

    if (isVacancies && checkedSkills.length) {
      const response = await TeamService.filterByVacancies(checkedSkills, token)

      if (response instanceof Error) {
        return notificationsStore.createSystemNotification(
          'Система',
          response.message,
        )
      }

      teams.value = response
    } else {
      const response = await TeamService.getTeams(token)

      if (response instanceof Error) {
        return notificationsStore.createSystemNotification(
          'Система',
          response.message,
        )
      }

      teams.value = response
    }
  }
})

function getCheckedSkills() {
  return filterBySkills.value.reduce<Skill[]>((prevSkills, skillName) => {
    const skill = skills.value.find(({ name }) => skillName === name)

    if (skill) prevSkills.push(skill)

    return prevSkills
  }, [])
}

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

function getStatusStyle(closed: boolean) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (closed) {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }

  initialClass.push('bg-success-subtle', 'text-success')
  return initialClass
}

function getTranslatedStatus(closed: boolean) {
  return closed ? 'Закрыта' : 'Открыта'
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

function navigateToCreateTeamForm() {
  router.push('/teams/create')
}

function navigateToUpdateTeamForm(team: Team) {
  router.push(`/teams/update/${team.id}`)
}

function handleOpenDeleteModal(team: Team) {
  deletingTeamId.value = team.id
  deletingTeamName.value = team.name
  isOpenedTeamDeleteModal.value = true
}

function handleCloseDeleteModal() {
  isOpenedTeamDeleteModal.value = false
}

async function handleDeleteTeam() {
  const currentUser = user.value

  if (currentUser?.token && deletingTeamId.value !== null) {
    const { token } = currentUser

    await teamsStore.deleteTeam(deletingTeamId.value, token)
  }
}

function checkCreateTeamButton() {
  const currentUser = user.value

  return currentUser?.role
    ? ['TEAM_OWNER', 'ADMIN'].includes(currentUser.role)
    : false
}

function checkUpdateTeamAction(team: Team) {
  const currentUser = user.value
  const { owner, leader } = team

  return (
    currentUser?.role === 'ADMIN' ||
    currentUser?.id === owner.id ||
    currentUser?.id === leader?.id
  )
}

function checkDeleteTeamAction(team: Team) {
  const currentUser = user.value
  const { owner } = team

  return currentUser?.role === 'ADMIN' || currentUser?.id === owner.id
}

function checkTeamStatus(team: Team, status: FilterValue) {
  return team.closed === status
}

function checkOwnerTeams(team: Team, userId: FilterValue) {
  return team.owner.id === userId
}

// function checkTeamVacancies(team: Team, isFilteringByVacancies: FilterValue) {
//   if (isFilteringByVacancies) {
//     const teamSkills = team.wantedSkills
//       .map(({ name }) => name)
//       .filter((skillName) => !team.skills.find(({ name }) => name === skillName))

//     return teamSkills.some((skillName) => filterBySkills.value.includes(skillName))
//   }
//   return true
// }

// function checkTeamSkill() {
//   const { role } = currentUser
//   if (role === 'INITIATOR') {
//     return team.skills.some(({ name }) => name === skill)
//   }
//   return (
//     team.skills.some(({ name }) => name === skill) ||
//     team.wantedSkills.some(({ name }) => name === skill)
//   )
// }
</script>
