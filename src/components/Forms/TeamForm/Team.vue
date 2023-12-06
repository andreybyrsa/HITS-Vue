<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFieldValue } from 'vee-validate'

import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import { TeamProps, TeamEmits } from '@Components/Forms/TeamForm/TeamForm.types'

import { User } from '@Domain/User'
import { TeamMember } from '@Domain/Team'

import useUserStore from '@Store/user/userStore'
import InvitationTeamMemberModal from '@Components/Modals/InvitationTeamMemberModal/InvitationTeamMemberModal.vue'

const invitationUsers = defineModel<User[]>({ required: true })

const props = defineProps<TeamProps>()
const emit = defineEmits<TeamEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const users = ref<TeamMember[]>([])
const owner = ref<TeamMember | undefined>(useFieldValue<TeamMember>('owner').value)
const leader = ref<TeamMember | undefined>(useFieldValue<TeamMember>('leader').value)
const members = ref<TeamMember[]>(useFieldValue<TeamMember[]>('members').value ?? [])

const isOpenedTeamInviteModal = ref(false)

onMounted(async () => {
  const currentUser = user.value

  if (currentUser) {
    if (!props.team) {
      owner.value = currentUser
      users.value = [currentUser]
    } else {
      users.value = [...props.team.members]
    }
  }
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

watch(
  members,
  (currentMembers) => emit('set-value', 'membersCount', currentMembers.length),
  { immediate: true },
)

function onUnselectMember(unselectedMember: TeamMember) {
  if (unselectedMember.email === leader.value?.email) {
    leader.value = undefined
  }
}

function unselectMember(unselectedMember: TeamMember) {
  const currentMemberIndex = members.value.findIndex(
    (member) => member.id === unselectedMember.id,
  )

  if (currentMemberIndex !== -1) {
    members.value.splice(currentMemberIndex, 1)

    onUnselectMember(unselectedMember)
  }
}

function unselectInviteUser(unselectedUser: User) {
  const currentUserIndex = invitationUsers.value.findIndex(
    ({ id }) => id === unselectedUser.id,
  )

  if (currentUserIndex !== -1) {
    invitationUsers.value.splice(currentUserIndex, 1)
  }
}

function getMemberColor(member: TeamMember | User) {
  const memberClassName = ['team__member', 'p-1', 'rounded-3', 'bg-opacity-25']

  if (member.id !== leader.value?.id) {
    memberClassName.push('bg-primary')
  } else {
    memberClassName.push('bg-danger')
  }

  return memberClassName
}

function openTeamInviteModal() {
  isOpenedTeamInviteModal.value = true
}
function closeTeamInviteModal() {
  isOpenedTeamInviteModal.value = false
}
</script>

<template>
  <div class="team w-100">
    <Combobox
      name="owner"
      label="Владелец команды*"
      :options="users"
      :display-by="['firstName', 'lastName']"
      v-model="owner"
      comparing-key="id"
      placeholder="Выберите владельца"
      :disabled="!team"
    />

    <Combobox
      name="leader"
      label="Тим-лидер команды*"
      :options="users"
      :display-by="['firstName', 'lastName']"
      comparing-key="id"
      v-model="leader"
      placeholder="Выберите тим-лидера"
    />

    <div class="w-100 d-flex flex-column">
      <Combobox
        name="members"
        label="Участники команды*"
        :options="users"
        :display-by="['firstName', 'lastName']"
        comparing-key="id"
        v-model="members"
        placeholder="Выберите участников"
        multiselect-placeholder="В команде"
        @on-unselect="onUnselectMember"
      />

      <div
        v-if="members.length"
        class="team__members mt-2"
      >
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

    <div class="d-flex flex-column">
      <div
        class="team__invite-button d-flex gap-2 text-primary"
        @click="openTeamInviteModal"
      >
        <div class="team__invite-link">Пригласить пользователей</div>
        <Icon class-name="bi bi-person-plus" />
      </div>

      <div
        v-if="invitationUsers.length"
        class="team__members mt-2"
      >
        <div
          v-for="(user, index) in invitationUsers"
          :key="index"
          :class="getMemberColor(user)"
        >
          <Typography>{{ user.firstName }} {{ user.lastName }}</Typography>
          <Icon
            class-name="team__member-delete-icon bi bi-x-lg"
            @click="unselectInviteUser(user)"
          />
        </div>
      </div>
    </div>

    <InvitationTeamMemberModal
      :is-opened="isOpenedTeamInviteModal"
      v-model="invitationUsers"
      @close-modal="closeTeamInviteModal"
    />
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

    &-placeholder {
      width: 100px;
    }
  }

  &__invite {
    &-button {
      cursor: pointer;

      &:hover {
        .team__invite-link {
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-thickness: 1px;
        }
      }
    }
  }
}
</style>
