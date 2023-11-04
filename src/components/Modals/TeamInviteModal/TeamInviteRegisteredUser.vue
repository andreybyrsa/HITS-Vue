<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useFieldArray, useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import useUserStore from '@Store/user/userStore'

import TeamMember from '@Domain/TeamMember'
import TeamService from '@Services/TeamService'

import UsersColumns from '@Components/UserColumns/UsersColumns.vue'
import {
  TeamInviteRegisteredUsersProps,
  TeamInviteRegisteredUsersEmits,
  TeamInviteRegisteredUsersForm,
} from '@Components/Modals/TeamInviteModal/TeamInviteModal.types'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'

defineProps<TeamInviteRegisteredUsersProps>()

const emit = defineEmits<TeamInviteRegisteredUsersEmits>()

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const searchedValue = ref('')

const isSeachUsersBySkills = ref<boolean>(false)
const profiles = ref<TeamMember[]>()

const { handleSubmit } = useForm<TeamInviteRegisteredUsersForm>({
  validationSchema: {
    users: (value: TeamMember[]) => value?.length > 0 || 'Выберите пользователей',
  },
})

onMounted(async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await TeamService.getAllTeamProfiles(token)

    if (response instanceof Error) {
      return //уведомление
    }

    profiles.value = response
  }
})

const { fields, push, remove } = useFieldArray<TeamMember>('profiles')

const inviteUsers = handleSubmit(async (values: TeamInviteRegisteredUsersForm) => {
  emit(
    'inviteRegisteredUsers',
    values.users.reduce<string[]>((emails, currentUser) => {
      emails.push(`${currentUser.email}`)
      return emails
    }, []),
  )
})

const searchedOptions = computed(() => {
  const currentSearchedValue = searchedValue.value.trim().toLocaleLowerCase()
  return isSeachUsersBySkills.value
    ? getUsersBySearchedValue(currentSearchedValue)
    : profiles.value?.reduce<TeamMember[]>((allProfiles, profile) => {
        const currentOptionSearchingFields = `${profile.firstName} ${profile.lastName} ${profile.email}`

        const isIncludesSeachedValue = currentOptionSearchingFields
          .trim()
          .toLocaleLowerCase()
          .includes(currentSearchedValue)

        if (isIncludesSeachedValue) {
          allProfiles.push(profile)
        }

        return allProfiles
      }, [])
})

function selectUser(profile: TeamMember, index: number) {
  searchedOptions.value?.splice(index, 1)
  profiles.value?.splice(
    profiles.value.findIndex(
      (currentProfile) => currentProfile.email == profile.email,
    ),
    1,
  )

  push(profile)
}

function unselectUser(profile: TeamMember, index: number) {
  searchedOptions.value?.push(profile)
  profiles.value?.push(profile)
  remove(index)
}

function getUsersBySearchedValue(searchedValue: string) {
  return profiles.value?.reduce<TeamMember[]>((allProfiles, profile) => {
    const profileContainsSkill = profile.skills.find((skill) =>
      skill.name.trim().toLocaleLowerCase().includes(searchedValue),
    )

    if (profileContainsSkill) {
      allProfiles.push(profile)
    }

    return allProfiles
  }, [])
}

function changeSearchMode() {
  isSeachUsersBySkills.value
    ? (isSeachUsersBySkills.value = false)
    : (isSeachUsersBySkills.value = true)
}
</script>
<template>
  <div
    v-if="profiles"
    class="invite-registered h-100"
  >
    <Input
      :name="`search-${name}`"
      class-name="rounded-end"
      v-model="searchedValue"
      no-form-controlled
      placeholder="Найти пользователя"
    />
    <Button
      class-name="btn btn-link"
      @click="changeSearchMode"
      >{{
        isSeachUsersBySkills ? 'Вернуть обычный поиск' : 'Искать по компетенциям'
      }}</Button
    >

    <UsersColumns
      v-if="searchedOptions"
      :users="fields"
      :unselected-users="searchedOptions"
      v-model="searchedOptions"
      :display-by="['firstName', 'lastName']"
      :email="'email'"
      @on-select="selectUser"
      @on-unselect="unselectUser"
    />

    <div class="invite-registered__form-controller">
      <Button
        class-name="btn-primary w-100"
        @click="inviteUsers"
        >Пригласить</Button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.invite-registered {
  @include flexible(stretch, space-between, column);

  &__form-controller {
    @include flexible(stretch, center, $gap: 16px);
  }
}
</style>
