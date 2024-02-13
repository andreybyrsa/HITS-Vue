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
import { ref, computed, onMounted } from 'vue'
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

import {
  sendParallelRequests,
  RequestConfig,
  openErrorNotification,
} from '@Utils/sendParallelRequests'

const invitationUsers = defineModel<TeamMember[]>({ required: true })
defineEmits<UsersInviteTableEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()

const skills = ref<Skill[]>()
const users = ref<TeamMember[]>()
const profile = ref<Profile>()

const filterBySkill = ref<Skill[]>([])
const searchBySkills = ref('')

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token, id } = currentUser

    const usersInviteParallelRequests: RequestConfig[] = [
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
        request: () => SkillsService.getAllUsersSkills(token),
        refValue: users,
        onErrorFunc: openErrorNotification,
      },
    ]

    await sendParallelRequests(usersInviteParallelRequests)
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
  return !invitationUsers.value.find(({ userId }) => userId === user.userId)
}

function checkIsExistUser(user: TeamMember) {
  return !!invitationUsers.value.find(({ userId }) => userId === user.userId)
}
</script>

<style lang="scss">
.user-invite-table {
  @include flexible(flex-start, space-between);
}
</style>
