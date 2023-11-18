<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useField, useFieldValue } from 'vee-validate'
import { watchImmediate } from '@vueuse/core'
import { useRoute } from 'vue-router'

import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import SkillsRadarCharts from '@Components/Charts/SkillsRadarChart/SkillsRadarCharts.vue'
import TeamPlaceholder from '@Components/Forms/TeamForm/TeamPlaceholder.vue'
import { SkillsForRadar, TeamProps } from '@Components/Forms/TeamForm/TeamForm.types'

import TeamMember from '@Domain/TeamMember'
import { Skill } from '@Domain/Skill'

import TeamService from '@Services/TeamService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const props = defineProps<TeamProps>()

const route = useRoute()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const notificationsStore = useNotificationsStore()

const users = ref<TeamMember[]>()
const owner = ref<TeamMember | undefined>(useFieldValue<TeamMember>('owner').value)
const leader = ref<TeamMember | undefined>(useFieldValue<TeamMember>('leader').value)
const members = ref<TeamMember[]>(useFieldValue<TeamMember[]>('members').value ?? [])

// const radarChartsSkills = ref<Skill[]>([])

const radarChartsSkills = ref<SkillsForRadar[]>([
  { label: 'Компетенции идеи', skills: [] },
  {
    label: 'Компетенции команды',
    skills: [],
  },
])

const { value: teamSkills } = useField<Skill[]>('skills', undefined, {
  validateOnMount: false,
  validateOnValueUpdate: true,
})

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { id, token } = currentUser

    const teamId = +route.params.id

    if (props.mode == 'editing') {
      const response = await TeamService.getTeam(teamId, token)

      if (response instanceof Error) {
        return notificationsStore.createSystemNotification(
          'Система',
          response.message,
        )
      }

      members.value = response.members

      owner.value = response.owner

      leader.value = response.leader

      users.value = members.value

      if (!users.value.find((member) => member.id == response.owner.id)) {
        users.value.push(response.owner)
      }
    } else {
      const response = await TeamService.getTeamProfile(id, token)

      if (response instanceof Error) {
        return notificationsStore.createSystemNotification(
          'Система',
          response.message,
        )
      }

      users.value = [response]

      owner.value = response
    }
  }
})

const teamUsers = computed(() => {
  const currentUsers = [...members.value, leader.value]
  const uniqueUsers = new Map<string, TeamMember>()
  currentUsers.forEach((user) => user && uniqueUsers.set(user.email, user))

  return [...uniqueUsers.values()]
})

watchImmediate(teamUsers, (currentTeam) => {
  const membersSkills: Skill[] = []

  currentTeam.forEach((member) => membersSkills.push(...member.skills))

  teamSkills.value = [
    ...new Map(membersSkills.map((skill) => [skill.id, skill])).values(),
  ]
  radarChartsSkills.value[1].skills = [...membersSkills]
})

watch(
  leader,
  (currentLeader, prevLeader) => {
    if (currentLeader) {
      const isExistLeader = members.value.find(
        (member) => member.email === currentLeader.email,
      )

      if (!isExistLeader) {
        const prevLeaderIndex = members.value.findIndex(
          (member) => member.email === prevLeader?.email,
        )
        if (prevLeaderIndex !== -1) {
          members.value.splice(prevLeaderIndex, 1)
        }
        if (prevLeader?.email === owner.value?.email) {
          owner.value = undefined
        }

        members.value.push(currentLeader)
      }
    }
  },
  { immediate: true },
)

function onUnselectMember(unselectedMember: TeamMember) {
  if (unselectedMember.email === leader.value?.email) {
    leader.value = undefined
  }
}

function unselectMember(unselectedMember: TeamMember) {
  const currentMemberIndex = members.value.findIndex(
    (member) => member.email === unselectedMember.email,
  )

  if (currentMemberIndex !== -1) {
    members.value.splice(currentMemberIndex, 1)

    onUnselectMember(unselectedMember)
  }
}

function getMemberColor(member: TeamMember) {
  const memberClassName = 'team__member p-1 rounded-3 bg-opacity-25 '
  return member.email !== leader.value?.email
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
      :disabled="mode == 'creating'"
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
              member.email === leader?.email ? -1 : 1,
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

      <SkillsRadarCharts
        class-name="w-50"
        :skills="radarChartsSkills"
      />
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
