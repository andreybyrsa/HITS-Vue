<template>
  <div v-if="users">
    <Table
      :data="users"
      :columns="inviteUserColumns"
      :search-by="['email', 'firstName', 'lastName']"
      :dropdown-actions-menu="dropdownInviteUserActions"
      :filters="usersFilters"
      v-model="invitationUsers"
    />
  </div>

  <TablePlaceholder v-else />
</template>

<script lang="ts" setup>
import { Ref, computed, onMounted, ref } from 'vue'
import { useRouter, RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'

import type { UsersInviteTableEmits } from '@Components/Tables/UsersInviteTable/UsersInviteTable.types'
import Table from '@Components/Table/Table.vue'
import { DropdownMenuAction, TableColumn } from '@Components/Table/Table.types'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'

import { TeamMember } from '@Domain/Team'
import { Skill } from '@Domain/Skill'
import { Profile } from '@Domain/Profile'

import SkillsService from '@Services/SkillsService'
import ProfileService from '@Services/ProfileService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { RequestResult, makeParallelRequests } from '@Utils/makeParallelRequests'

const invitationUsers = defineModel<TeamMember[]>({ required: true })
defineEmits<UsersInviteTableEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const router = useRouter()

const skills = ref<Skill[]>()
const users = ref<TeamMember[]>()
const profile = ref<Profile>()

const filterBySkill = ref<Skill[]>([])
const searchBySkills = ref('')

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
    const { token, id } = currentUser

    const usersInviteParallelRequests = [
      () => SkillsService.getAllSkills(token),
      () => ProfileService.getUserProfile(id, token),
      () => SkillsService.getAllUsersSkills(token),
    ]

    await makeParallelRequests<TeamMember[] | Skill[] | Profile | Error>(
      usersInviteParallelRequests,
    ).then((responses) => {
      responses.forEach((response) => {
        if (response.id === 0) {
          checkResponseStatus(response, skills)
        } else if (response.id === 1) {
          checkResponseStatus(response, profile)
        } else if (response.id === 2) {
          checkResponseStatus(response, users)
        }
      })
    })
  }
})

const inviteUserColumns: TableColumn<TeamMember>[] = [
  {
    key: 'email',
    label: 'Почта',
    size: 'col-4',
    rowCellClick: navigateToUserProfile,
  },
  {
    key: 'firstName',
    label: 'Имя',
    size: 'col-4',
  },
  {
    key: 'lastName',
    label: 'Фамилия',
    size: 'col-6',
  },
]

const usersFilters = computed<Filter<TeamMember>[]>(() => [
  {
    category: 'Компетенции',
    searchValue: searchBySkills,
    choices: getFilterSkills(),
    refValue: filterBySkill,
    isUniqueChoice: false,
    checkFilter: filterUsersWithSkillls,
  },
])

function filterUsersWithSkillls(user: TeamMember, filterSkill: FilterValue) {
  return user.skills.find((skill) => skill.name === filterSkill)
}

const dropdownInviteUserActions: DropdownMenuAction<TeamMember>[] = [
  { label: 'Перейти на профиль', click: navigateToUserProfile },
  {
    label: 'Выбрать',
    statement: checkIsNotExistUser,
    click: chooseUser,
    className: 'text-success',
  },
  {
    label: 'Отменить выбор',
    statement: checkIsExistUser,
    click: unselectUser,
    className: 'text-danger',
  },
]

function getFilterSkills() {
  return skills.value
    ? skills.value
        .map(({ name }) => ({
          label: name,
          value: name,
          isMarked: !!profile.value?.skills.find((skill) => skill.name === name),
        }))
        .sort((a, b) => +b.isMarked - +a.isMarked)
    : []
}

function chooseUser(user: TeamMember) {
  invitationUsers.value.push(user)
}

function unselectUser(user: TeamMember) {
  const currentUserIndex = invitationUsers.value.findIndex(
    ({ id }) => id === user.id,
  )

  invitationUsers.value.splice(currentUserIndex, 1)
}

function navigateToUserProfile(user: TeamMember) {
  const profileRoute: RouteRecordRaw = {
    name: 'profile',
    path: 'profile/:id',
    alias: '/profile/:id',
    component: ProfileModal,
    props: {
      canGoBack: true,
    },
  }

  router.addRoute('create-team', profileRoute)
  router.push({ path: `/profile/${user.userId}` })
}

function checkIsNotExistUser(user: TeamMember) {
  return !invitationUsers.value.find(({ id }) => id === user.id)
}

function checkIsExistUser(user: TeamMember) {
  return !!invitationUsers.value.find(({ id }) => id === user.id)
}
</script>

<style lang="scss">
.user-invite-table {
  @include flexible(flex-start, space-between);
}
</style>
