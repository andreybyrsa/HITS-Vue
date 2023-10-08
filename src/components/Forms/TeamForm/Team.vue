<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useField, useFieldValue } from 'vee-validate'
import { watchImmediate } from '@vueuse/core'

import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import SkillsRadarCharts from '@Components/Forms/TeamForm/SkillsRadarCharts.vue'
import TeamPlaceholder from '@Components/Forms/TeamForm/TeamPlaceholder.vue'

import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'

import ManageUsersService from '@Services/ManageUsersService'

import useUserStore from '@Store/user/userStore'
import SkillsService from '@Services/SkillService'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const users = ref<User[]>()
const owner = ref<User | undefined>(useFieldValue<User>('owner').value)
const leader = ref<User | undefined>(useFieldValue<User>('leader').value)
const members = ref<User[]>(useFieldValue<User[]>('members').value ?? [])

const radarChartsSkills = ref<Skill[]>([])

const { value: teamSkills } = useField<Skill[]>('skills', undefined, {
  validateOnMount: false,
  validateOnValueUpdate: true,
})

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await SkillsService.getAllSkillsUsers(token)

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
  const currentUsers = [...members.value, leader.value, owner.value]
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
  radarChartsSkills.value = membersSkills
})

watch(
  owner,
  (currenOwner, prevOwner) => {
    if (currenOwner) {
      const isExistOwner = members.value.find(
        (member) => member.id === currenOwner.id,
      )

      if (!isExistOwner) {
        const prevOwnerIndex = members.value.findIndex(
          (member) => member.id === prevOwner?.id,
        )
        if (prevOwnerIndex !== -1) {
          members.value.splice(prevOwnerIndex, 1)
        }

        if (prevOwner?.id == leader.value?.id) {
          leader.value = undefined
        }

        members.value.push(currenOwner)
      }
    }
  },
  { immediate: true },
)

watch(
  leader,
  (currentLeader, prevLeader) => {
    if (currentLeader) {
      const isExistLeader = members.value.find(
        (member) => member.id === currentLeader.id,
      )

      if (!isExistLeader) {
        const prevLeaderIndex = members.value.findIndex(
          (member) => member.id === prevLeader?.id,
        )
        if (prevLeaderIndex !== -1) {
          members.value.splice(prevLeaderIndex, 1)
        }
        if (prevLeader?.id === owner.value?.id) {
          owner.value = undefined
        }

        members.value.push(currentLeader)
      }
    }
  },
  { immediate: true },
)

function onUnselectMember(unselectedMember: User) {
  if (unselectedMember.id === leader.value?.id) {
    leader.value = undefined
  }
  if (unselectedMember.id === owner.value?.id) {
    owner.value = undefined
  }
}

function unselectMember(unselectedMember: User) {
  const currentMemberIndex = members.value.findIndex(
    (member) => member.id === unselectedMember.id,
  )

  if (currentMemberIndex !== -1) {
    members.value.splice(currentMemberIndex, 1)

    onUnselectMember(unselectedMember)
  }
}

function getMemberColor(member: User) {
  const memberClassName = 'team__member p-1 rounded-3 bg-opacity-25 '
  return member.id !== leader.value?.id
    ? memberClassName + 'bg-primary'
    : memberClassName + 'bg-danger'
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
      <div class="w-50 d-flex flex-column">
        <Combobox
          name="members"
          label="Участники команды*"
          :options="users"
          :display-by="['firstName', 'lastName']"
          v-model="members"
          placeholder="Выберите участников"
          multiselect-placeholder="В команде"
          @on-unselect="onUnselectMember"
        />

        <div class="team__members mt-2">
          <div
            v-for="(member, index) in members.sort((member) =>
              member.id === leader?.id ? -1 : 1,
            )"
            :key="index"
            :class="getMemberColor(member)"
          >
            <Typography>{{ member.firstName }} {{ member.lastName }}</Typography>
            <Icon
              class-name="team__member-delete-icon bi bi-x-lg"
              @click="unselectMember(member)"
            />
          </div>
        </div>
      </div>

      <SkillsRadarCharts :skills="radarChartsSkills" />
    </div>
  </div>

  <TeamPlaceholder v-else />
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

    &-placeholder {
      width: 100px;
    }
  }
}
</style>
