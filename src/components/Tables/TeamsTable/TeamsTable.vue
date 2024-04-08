<template>
  <Table
    class-name="p-3"
    :header="teamsTableHeader"
    :columns="teamTableColumns"
    :checked-data-actions="checkedTeamsActions"
    :data="teams"
    :search-by="['name', 'description', 'tags']"
    :filters="teamsFilters"
    :dropdown-actions-menu="dropdownTeamsActions"
    :is-checkbox="user?.role === 'PROJECT_OFFICE'"
  />

  <DeleteModal
    :is-opened="isOpenedTeamDeleteModal"
    :item-name="deletingTeamName?.toString()"
    @close-modal="handleCloseDeleteModal"
    @delete="handleDeleteTeam"
  />

  <ConfirmModal
    :is-opened="isOpenedConfirmModalAccepted"
    text-button="Пригласить команду"
    text-question="Вы действительно хотите пригласить команду?"
    @close-modal="closeConfirmModalAccepted"
    @action="
      currentTeam && currentIdea && handleInviteTeam(currentTeam, currentIdea)
    "
  />

  <ConfirmModal
    :is-opened="isOpenedConfirmModalCanceled"
    text-button="Отозвать команду"
    text-question="Вы действительно хотите отозвать команду?"
    @close-modal="closeConfirmModalCanceled"
    @action="currentInvitation && handleRevokeTeam(currentInvitation)"
  />
  <CreateLaunchQuestModal
    :isOpened="isOpenSendFormModal"
    :teams="sendingTeams"
    @close-modal="closeSendFormModal"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useDateFormat, watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import Table from '@Components/Table/Table.vue'
import {
  TableColumn,
  DropdownMenuAction,
  TableHeader,
  CheckedDataAction,
} from '@Components/Table/Table.types'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import DeleteModal from '@Components/Modals/DeleteModal/DeleteModal.vue'
import CreateLaunchQuestModal from '@Components/Modals/LaunchQuestModal/CreateLaunchQuestModal.vue'

import { Team } from '@Domain/Team'
import { Skill } from '@Domain/Skill'
import { Profile } from '@Domain/Profile'

import SkillsService from '@Services/SkillsService'
import ProfileService from '@Services/ProfileService'
import TeamService from '@Services/TeamService'
import useUserStore from '@Store/user/userStore'
import useTeamStore from '@Store/teams/teamsStore'
import useInvitationsTeamToIdeaStore from '@Store/invitationTeamToIdea/invitationTeamToIdeaStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useIdeasMarketStore from '@Store/ideasMarket/ideasMarket'

import {
  sendParallelRequests,
  RequestConfig,
  openErrorNotification,
} from '@Utils/sendParallelRequests'
import { InvitationTeamToIdea } from '@Domain/InvitationTeamToIdea'
import { IdeaMarket } from '@Domain/IdeaMarket'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasMarketStore = useIdeasMarketStore()

const teamsStore = useTeamStore()

const notificationsStore = useNotificationsStore()

const router = useRouter()

const teams = defineModel<Team[]>({ required: true })
const ideas = ref<IdeaMarket[]>([])
const skills = ref<Skill[]>([])
const profile = ref<Profile>()

const invitationsTeamToIdeaStore = useInvitationsTeamToIdeaStore()
const { ideaInvitations } = storeToRefs(invitationsTeamToIdeaStore)

const deletingTeamId = ref<string | null>(null)
const deletingTeamName = ref<string>()

const filterByIsClosed = ref<boolean>()
const filterByIsHasActiveProject = ref<boolean>()
const filterByIsFree = ref<boolean>()
const filterByOwnerTeams = ref<string>()
const filterByVacancies = ref<boolean>(false)
const filterBySkills = ref<string[]>([])
const filterByStatusQuest = ref<boolean>()

const searchBySkills = ref('')

const isSortedByMembersCount = ref(false)
const isSortedByCreatedAt = ref(false)
const isSortByPrivacy = ref(false)
const isSortByStatus = ref(false)
const isSortByName = ref(false)
const isOpenedTeamDeleteModal = ref(false)

const isOpenedConfirmModalAccepted = ref(false)
const isOpenedConfirmModalCanceled = ref(false)

const currentTeam = ref<Team>()
const currentIdea = ref<IdeaMarket>()
const currentInvitation = ref<InvitationTeamToIdea>()

const computedIsInitiator = computed<boolean>(() => user.value?.role == 'INITIATOR')

const checkedTeamsActions = computed<CheckedDataAction<Team>[]>(() => [
  {
    label: 'Создать опрос для выбранных команд',
    className: 'btn-primary',
    statement: user.value?.role == 'PROJECT_OFFICE',
    click: (teams) => openSendFormModal(teams),
  },
])

const sendingTeams = ref<Team[]>([])
const isOpenSendFormModal = ref<boolean>(false)

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
      {
        request: () =>
          ideasMarketStore.getAllInitiatorMarketIdeasByUserId(id, token),
        refValue: ideas,
        onErrorFunc: openErrorNotification,
      },
    ]

    await sendParallelRequests(teamsTableParallelRequests)
  }
})

watchImmediate(
  () => user.value?.role,
  async (role) => {
    if (role === 'INITIATOR') {
      const currentUser = user.value

      if (currentUser?.token) {
        const { token, id } = currentUser

        await invitationsTeamToIdeaStore.getIdeaInvitationsByInitiator(id, token)
      }
    }
  },
)

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

const dropdownTeamsActions = computed<DropdownMenuAction<Team>[]>(() => [
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
  // ...ideas.value.map((idea) => {
  //   return {
  //     label: `Пригласить в "${idea.name}"`,
  //     beforeLabel: `Отозвать из "${idea.name}"`,
  //     statementLabel: (team: Team) => getAccessInvitationsInIdeaMarket(team, idea),
  //     statement: checkByUserRole,
  //     click: async (team: Team) =>
  //       getAccessInvitationsInIdeaMarket(team, idea)
  //         ? openConfirmModalCanceled()
  //         : openConfirmModalAccepted(),
  //   }
  // }),
])

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
    label: 'Приватность',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellStyle: getStatusStyle,
    getRowCellFormat: getTranslatedStatus,
    headerCellClick: sortByPrivacy,
  },
  {
    key: 'name',
    label: 'Название',
    size: 'col-3',
    rowCellClick: navigateToTeamModal,
    headerCellClick: sortByName,
  },
  {
    key: 'hasActiveProject',
    label: 'Статус',
    contentClassName: 'justify-content-center align-items-center text-center',
    getRowCellStyle: getStatusWorkStyle,
    getRowCellFormat: getTranslatedWorkStatus,
    headerCellClick: sortByStatus,
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
    category: 'Приглашения в ваши идеи',
    choices: [
      { label: 'Не приглашены', value: false },
      { label: 'Приглашены', value: true },
    ],
    refValue: filterByIsFree,
    isUniqueChoice: true,
    checkFilter: checkIsTeamSent,
    statement: computedIsInitiator,
  },
  {
    category: 'Приватность',
    choices: [
      { label: 'Открытая команда', value: false },
      { label: 'Закрытая команда', value: true },
    ],
    refValue: filterByStatusQuest,
    isUniqueChoice: true,
    checkFilter: checkTeamStatus,
  },
  {
    category: 'Опросы',
    choices: [
      { label: 'Опрос не пройден', value: false },
      { label: 'Опрос пройден', value: true },
    ],
    refValue: filterByIsClosed,
    isUniqueChoice: true,
    checkFilter: checkStatusQuest,
  },
  {
    category: 'Статус',
    choices: [
      { label: 'В поисках', value: false },
      { label: 'В работе', value: true },
    ],
    refValue: filterByIsHasActiveProject,
    isUniqueChoice: true,
    checkFilter: checkTeamHasActiveProject,
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
  // {
  //   category: 'Номер курса',
  //   choices: teams.value.map(({ studyCourses }, index) => ({
  //     label: studyCourses[index],
  //     value: studyCourses[index],
  //   })),

  //   refValue: filterBySkills,
  //   isUniqueChoice: false,
  //   searchValue: searchBySkills,
  //   checkFilter: () => true,
  // },
])

function getAccessInvitationsInIdeaMarket(team: Team, idea: IdeaMarket) {
  const { id: currentTeamId } = team
  const { ideaId: currentIdeaId } = idea

  const currentsInvitesIdea = ideaInvitations.value.filter(
    ({ ideaId, status }) => ideaId === currentIdeaId && status === 'NEW',
  )
  const isTeamInviteInIdea = currentsInvitesIdea.find(
    ({ teamId }) => teamId === currentTeamId,
  )

  currentTeam.value = team
  currentIdea.value = idea
  currentInvitation.value = isTeamInviteInIdea

  return Boolean(isTeamInviteInIdea)
}

function checkByUserRole() {
  return user.value?.role === 'INITIATOR'
}

async function handleInviteTeam(team: Team, ideaMarket: IdeaMarket) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token, id: userId } = currentUser
    const { ideaId, name: ideaName } = ideaMarket
    const { id: teamId, name: teamName, membersCount, wantedSkills } = team

    const invitation: InvitationTeamToIdea = {
      id: '',
      ideaId: ideaId,
      ideaName: ideaName,
      status: 'NEW',
      initiatorId: userId,
      teamId: teamId,
      teamName: teamName,
      teamMembersCount: membersCount,
      skills: wantedSkills,
    }

    await invitationsTeamToIdeaStore.postInvitationsToIdea(invitation, token)
  }
}

async function handleRevokeTeam(invitation: InvitationTeamToIdea) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { id } = invitation

    await invitationsTeamToIdeaStore.putInvitationForTeamToIdea(
      'WITHDRAWN',
      id,
      token,
    )
  }
}

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

function sortByPrivacy() {
  teams.value.sort((team1, team2) => {
    const booleanValue1 = team1.membersCount
    const booleanValue2 = team2.membersCount

    if (isSortByPrivacy.value) {
      return booleanValue1 - booleanValue2
    } else {
      return booleanValue2 - booleanValue1
    }
  })
  isSortByPrivacy.value = !isSortByPrivacy.value
}

function sortByStatus() {
  teams.value.sort((team1, team2) => {
    const booleanValue1 = team1.membersCount
    const booleanValue2 = team2.membersCount

    if (isSortByStatus.value) {
      return booleanValue1 - booleanValue2
    } else {
      return booleanValue2 - booleanValue1
    }
  })
  isSortByStatus.value = !isSortByStatus.value
}

function sortByName() {
  teams.value.sort((team1, team2) => {
    const string1 = team1.name.toLowerCase()
    const string2 = team2.name.toLowerCase()

    if (isSortByName.value) {
      return string1.localeCompare(string2)
    } else {
      return string2.localeCompare(string1)
    }
  })
  isSortByName.value = !isSortByName.value
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

function getStatusWorkStyle(workStatus: boolean) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (workStatus) {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }

  initialClass.push('bg-primary-subtle', 'text-primary')
  return initialClass
}

function getTranslatedStatus(closed: boolean) {
  return closed ? 'Закрыта' : 'Открыта'
}

function getTranslatedWorkStatus(workStatus: boolean) {
  return workStatus ? 'В работе' : 'В поисках'
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

function openConfirmModalAccepted() {
  isOpenedConfirmModalAccepted.value = true
}

function closeConfirmModalAccepted() {
  isOpenedConfirmModalAccepted.value = false
}

isOpenedConfirmModalCanceled

function openConfirmModalCanceled() {
  isOpenedConfirmModalCanceled.value = true
}

function closeConfirmModalCanceled() {
  isOpenedConfirmModalCanceled.value = false
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
function checkStatusQuest(team: Team, status: FilterValue) {
  return team.StatusQuest === status
}

function checkTeamHasActiveProject(team: Team, status: FilterValue) {
  return team.hasActiveProject === status
}

function checkIsTeamSent(team: Team, status: FilterValue) {
  const result = ideaInvitations.value.find(
    (invitation) => invitation.teamId == team.id && invitation.status === 'NEW',
  )

  return Boolean(result) === status
}

function checkOwnerTeams(team: Team, userId: FilterValue) {
  return team.owner.id === userId
}

function openSendFormModal(teams: Team[]) {
  sendingTeams.value = [...teams]
  isOpenSendFormModal.value = true
}
function closeSendFormModal() {
  isOpenSendFormModal.value = false
}
// Ошибка фильтрации команд

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
