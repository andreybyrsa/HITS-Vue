<template>
  <div v-if="users">
    <Typography class-name="fs-5 text-primary">
      Выберите пользователей для приглашения
    </Typography>
    <Table
      :data="users"
      :columns="inviteUserColumns"
      :search-by="['email', 'firstName', 'lastName']"
      :dropdown-actions-menu="dropdownInviteUserActions"
      :filters="usersFilters"
      :checked-data-actions="checkedUsersActions"
      v-model="invitationUsers"
    ></Table>
  </div>

  <TablePlaceholder v-else />
</template>

<script lang="ts" setup>
import { Ref, computed, onMounted, ref } from 'vue'
import { useRouter, RouteRecordRaw, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import type { UsersInviteTableEmits } from '@Components/Tables/UsersInviteTable/UsersInviteTable.types'
import Table from '@Components/Table/Table.vue'
import {
  CheckedDataAction,
  DropdownMenuAction,
  TableColumn,
} from '@Components/Table/Table.types'
import ProfileModal from '@Components/Modals/ProfileModal/ProfileModal.vue'
import { Filter } from '@Components/FilterBar/FilterBar.types'
import TablePlaceholder from '@Components/Table/TablePlaceholder.vue'
import Typography from '@Components/Typography/Typography.vue'

import useUserStore from '@Store/user/userStore'

import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import UsersSkills from '@Domain/UsersSkills'
import Profile from '@Domain/Profile'

import ManageUsersService from '@Services/ManageUsersService'
import SkillsService from '@Services/SkillsService'
import ProfileService from '@Services/ProfileService'

import useNotificationsStore from '@Store/notifications/notificationsStore'

import { RequestResult, makeParallelRequests } from '@Utils/makeParallelRequests'
import TeamService from '@Services/TeamService'
import useInvitationUsersStore from '@Store/invitationUsers/invitationUsers'

const invitationUsers = defineModel<User[]>({ required: true })

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const emit = defineEmits<UsersInviteTableEmits>()

const router = useRouter()
const route = useRoute()

const users = ref<User[]>()
const skills = ref<Skill[]>()
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

    const profileParallelRequests = [
      () => ManageUsersService.getUsers(token),
      () => SkillsService.getAllSkills(token),
      () => ProfileService.getUserProfile(id, token),
    ]

    await makeParallelRequests<User[] | UsersSkills[] | Skill[] | Profile | Error>(
      profileParallelRequests,
    ).then((responses) => {
      responses.forEach((response) => {
        if (response.id === 0) {
          checkResponseStatus(response, users)
        } else if (response.id === 1) {
          checkResponseStatus(response, skills)
        } else if (response.id === 2) {
          checkResponseStatus(response, profile)
        }
      })
    })
  }
})

const inviteUserColumns: TableColumn<User>[] = [
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

const checkedUsersActions: CheckedDataAction<User>[] = [
  {
    label: 'Пригласить пользователей',
    className: 'btn-success',
    statement: route.name !== 'create-team',
    click: inviteUsersInTeam,
  },
]

const invitatinUsers = useInvitationUsersStore()
async function inviteUsersInTeam() {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const { teamId } = route.params

    await invitatinUsers.inviteUsers(invitationUsers.value, teamId.toString(), token)

    invitationUsers.value = []
    emit('close-modal')
  }
}

const usersFilters = computed<Filter<User>[]>(() => [
  {
    category: 'Компетенции',
    searchValue: searchBySkills,
    choices: getFilterSkills(),
    refValue: filterBySkill,
    isUniqueChoice: false,
    checkFilter: () => true,
  },
])

const dropdownInviteUserActions: DropdownMenuAction<User>[] = [
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

function chooseUser(user: User) {
  invitationUsers.value.push(user)
}

function unselectUser(user: User) {
  const currentUserIndex = invitationUsers.value.findIndex(
    ({ id }) => id === user.id,
  )

  invitationUsers.value.splice(currentUserIndex, 1)
}

function navigateToUserProfile(user: User) {
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
  router.push({ path: `/profile/${user.id}` })
}

function checkIsNotExistUser(user: User) {
  return !invitationUsers.value.find(({ id }) => id === user.id)
}

function checkIsExistUser(user: User) {
  return !!invitationUsers.value.find(({ id }) => id === user.id)
}
</script>
