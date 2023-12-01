<template>
  <div class="search-users border rounded-4">
    <div class="d-flex w-100 p-2 px-3 gap-3">
      <div class="search-users__main gap-3">
        <div class="w-100">
          <Input
            name="search"
            class-name="rounded-end"
            no-form-controlled
            v-model="searchedValue"
            placeholder="Поиск"
          >
            <template #prepend>
              <Icon class-name="bi bi-search" />
            </template>
          </Input>
        </div>

        <div class="overflow-y-auto w-100">
          <div>
            <Button
              v-for="(user, index) in usersData"
              :key="index"
              @click="addUserToParent(user)"
              class="search-users__element p-1"
            >
              <img
                src="https://static.thenounproject.com/png/363640-200.png"
                alt="avatar"
                class="h-100"
              />

              <div>
                {{ user.firstName }}
                {{ user.lastName }}
              </div>
            </Button>
          </div>
        </div>

        <div v-if="users?.length === 0">
          <Typography class-name="text-secondary">Никого не осталось</Typography>
        </div>
      </div>

      <FilterBar
        v-if="filters"
        class-name="ms-2 border-start"
        :filters="filters"
      />
    </div>

    <Button
      class="search-users__invite gap-2 w-100 rounded-bottom-4 rounded-top-0 border p-3"
    >
      <Icon class-name="bi bi-plus-circle-fill fs-4 text-primary"></Icon>
      <Typography class-name="text-primary">Пригласить на портал </Typography>
    </Button>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, Ref, onMounted } from 'vue'
import { User } from '@Domain/User'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Icon from '@Components/Icon/Icon.vue'
import FilterBar from '@Components/FilterBar/FilterBar.vue'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import Typography from '@Components/Typography/Typography.vue'
import { Skill } from '@Domain/Skill'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import SkillsService from '@Services/SkillsService'
import { RequestResult, makeParallelRequests } from '@Utils/makeParallelRequests'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import Profile from '@Domain/Profile'
import ProfileService from '@Services/ProfileService'
import { Team } from '@Domain/Team'
import UsersSkills from '@Domain/UsersSkills'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const users = inject<Ref<User[]>>('users')
const usersSkills = inject<Ref<UsersSkills[]>>('usersSkills')

const profile = ref<Profile>()
const skills = ref<Skill[]>([])

const filterBySkills = ref<string[]>([])

const searchBySkills = ref('')
const searchedValue = ref('')

const emits = defineEmits(['addUser'])
const addUserToParent = (user: User) => {
  emits('addUser', user)
}

const searchBy: (keyof User)[] = ['firstName', 'lastName']

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
  }
})

const filters = computed<Filter<Team>[]>(() => [
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

const usersData = computed(() => {
  if (searchedValue.value) {
    return users?.value.filter((user) => {
      const currentDataByKeys = searchBy.map((key) =>
        `${user[key]}`.toLocaleLowerCase().trim(),
      )

      const currentSearchedValue = searchedValue.value
        .toLocaleLowerCase()
        .trim()
        .split(' ')

      return currentSearchedValue.every((searchWord) =>
        currentDataByKeys.some((dataByKey) => dataByKey.includes(searchWord)),
      )
    })
  }
  if (filterBySkills.value.length) {
    return users?.value.filter((user) => {
      const filters = filterBySkills.value
      const userSkills = usersSkills?.value.find(
        (userSkills) => userSkills.idUsers === user.id,
      )
      return userSkills?.skills.find((skill) => filters.includes(skill.name))
    })
  }
  return users?.value
})
</script>

<style lang="scss" scoped>
.search-users {
  width: 75%;
  @include flexible(start, space-between, column);

  &__main {
    width: 70%;
    max-height: 80vh;
    @include flexible(center, start, column);
  }

  &__element {
    height: 35px;
    width: fit-content;
    margin-bottom: 8px;
    @include flexible(center, start, $gap: 8px);
  }

  &__element:hover {
    background-color: rgb(228, 228, 228);
    border-radius: 24px;
  }

  &__invite {
    @include flexible(center, start);
    background-color: rgb(235, 234, 234);
  }

  &__invite:hover {
    background-color: rgb(221, 221, 221);
  }
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgb(209, 209, 209);
  border-radius: 20px;
}

::-webkit-scrollbar-thumb {
  background-color: #0d6efd;
  border-radius: 20px;
  border: 3px solid #0d6efd;
}
</style>
