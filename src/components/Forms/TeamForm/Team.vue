<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useField, useFieldValue } from 'vee-validate'
import { watchImmediate } from '@vueuse/core'

import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import ColumnChart from '@Components/ColumnChart/ColumnChart.vue'

import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'

import ManageUsersService from '@Services/ManageUsersService'

import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const users = ref<User[]>()
const owner = ref<User>(useFieldValue<User>('owner').value)
const leader = ref<User>(useFieldValue<User>('leader').value)
const members = ref<User[]>(useFieldValue<User[]>('members').value ?? [])

const columnChartSkills = ref<Skill[]>([])

const { value: teamSkills } = useField('skills', undefined, {
  validateOnMount: false,
  validateOnValueUpdate: true,
})

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = (await new Promise((resolve) => setTimeout(resolve, 1000)).then(
      () => [
        {
          id: '1',
          firstName: 'Андрей',
          lastName: 'Бырса',
          skills: [
            { id: '1', name: 'JavaScript', type: 'LANGUAGE' },
            { id: '1', name: 'JavaScript', type: 'LANGUAGE' },
            { id: '1', name: 'JavaScript', type: 'LANGUAGE' },
            { id: '1', name: 'JavaScript', type: 'LANGUAGE' },
            { id: '1', name: 'JavaScript', type: 'LANGUAGE' },
            { id: '1', name: 'JavaScript', type: 'LANGUAGE' },
            { id: '1', name: 'JavaScript', type: 'LANGUAGE' },
            { id: '2', name: 'React', type: 'FRAMEWORK' },
          ],
        },
        {
          id: '2',
          firstName: 'Тимур',
          lastName: 'Минязев',
          skills: [
            { id: '3', name: 'Docker', type: 'DEVOPS' },
            { id: '2', name: 'React', type: 'FRAMEWORK' },
            { id: '2', name: 'React', type: 'FRAMEWORK' },
            { id: '2', name: 'React', type: 'FRAMEWORK' },
          ],
        },
        {
          id: '3',
          firstName: 'Кирилл',
          lastName: 'Власов',
          skills: [
            { id: '4', name: 'Java', type: 'Language' },
            { id: '5', name: 'Vue', type: 'FRAMEWORK' },
            { id: '5', name: 'Vue', type: 'FRAMEWORK' },
            { id: '5', name: 'Vue', type: 'FRAMEWORK' },
            { id: '6', name: 'SQL', type: 'DATABASE' },
          ],
        },
        {
          id: '4',
          firstName: 'Мамед',
          lastName: 'Байрамов',
          skills: [
            { id: '1', name: 'JavaScript', type: 'Language' },
            { id: '6', name: 'SQL', type: 'DATABASE' },
            { id: '1', name: 'JavaScript', type: 'LANGUAGE' },
            { id: '5', name: 'Vue', type: 'FRAMEWORK' },
            { id: '2', name: 'React', type: 'FRAMEWORK' },
          ],
        },
      ],
    )) as User[]

    users.value = response

    if (!owner.value) {
      const currentOwner = response.find((user) => user.id === currentUser.id)

      if (currentOwner) {
        owner.value = currentOwner
      }
    }
  }
})

const teamUsers = computed(() => {
  const currentUsers = [...members.value, owner.value, leader.value]
  const uniqueUsers = new Map<string, User>()
  currentUsers.forEach((user) => user && uniqueUsers.set(user.id, user))

  return [...uniqueUsers.values()]
})

watchImmediate(teamUsers, (currentTeam) => {
  const membersSkills: Skill[] = []

  currentTeam.forEach((member) => membersSkills.push(...member.skills))

  teamSkills.value = [
    ...new Map(membersSkills.map((skill) => [skill.id, skill])).values(),
  ]
  columnChartSkills.value = membersSkills
})

function unselectMember(index: number) {
  members.value.splice(index, 1)
}
</script>

<template>
  <div
    v-if="users"
    class="team w-100"
  >
    <Combobox
      name="owner"
      label="Владелец команды*"
      :options="users"
      :display-by="['firstName', 'lastName']"
      v-model="owner"
      placeholder="Выберите владельца"
    />

    <Combobox
      name="leader"
      label="Тим-лидер команды*"
      :options="users"
      :display-by="['firstName', 'lastName']"
      v-model="leader"
      placeholder="Выберите тим-лидера"
    />

    <div class="w-100 d-flex gap-3">
      <div class="w-50">
        <Combobox
          name="members"
          label="Участники команды*"
          :options="users"
          :display-by="['firstName', 'lastName']"
          v-model="members"
          placeholder="Выберите участников"
          multiselect-placeholder="В команде"
        />

        <div
          v-if="members.length"
          class="team__members mt-2"
        >
          <div
            v-for="(member, index) in members"
            :key="index"
            class="team__member p-1 rounded-3 bg-primary bg-opacity-25"
          >
            <Typography>{{ member.firstName }} {{ member.lastName }}</Typography>
            <Icon
              class-name="team__member-delete-icon bi bi-x-lg"
              @click="unselectMember(index)"
            />
          </div>
        </div>
      </div>

      <ColumnChart
        class-name="w-50"
        :options="columnChartSkills"
        display-by="name"
      />
    </div>
  </div>

  <div
    v-else
    class="w-100 d-flex flex-column gap-3"
  >
    <LoadingPlaceholder
      v-for="index in 2"
      :key="index"
      height="small"
    />

    <div class="w-100 d-flex gap-3">
      <div class="w-50">
        <LoadingPlaceholder height="small" />
        <div class="mt-1 d-flex gap-3">
          <LoadingPlaceholder
            v-for="index in 3"
            :key="index"
          />
        </div>
      </div>

      <div class="w-50">
        <LoadingPlaceholder height="medium" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.team {
  @include flexible(stretch, flex-start, column, $gap: 16px);

  &__members {
    @include flexible(flex-start, flex-start, $flex-wrap: wrap, $gap: 8px);
  }

  &__member {
    @include flexible(center, center, $gap: 4px);

    &-delete-icon {
      cursor: pointer;
    }
  }
}
</style>
