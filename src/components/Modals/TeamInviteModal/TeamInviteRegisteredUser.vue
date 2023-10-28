<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useFieldArray, useForm } from 'vee-validate'

import UsersColumns from '@Components/UserColumns/UsersColumns.vue'
import {
  TeamInviteRegisteredUsersProps,
  TeamInviteRegisteredUsersEmits,
  TeamInviteRegisteredUsersForm,
} from '@Components/Modals/TeamInviteModal/TeamInviteModal.types'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'

import Profile from '@Domain/Profile'

import ProfileService from '@Services/ProfileService'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'

defineProps<TeamInviteRegisteredUsersProps>()

const emit = defineEmits<TeamInviteRegisteredUsersEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const searchedValue = ref('')

const profiles = ref<Profile[]>()

const isSeachUsersBySkills = ref<boolean>(false)

const { handleSubmit } = useForm<TeamInviteRegisteredUsersForm>({
  validationSchema: {
    users: (value: Profile[]) => value?.length > 0 || 'Выберите пользователей',
  },
})

const { fields, push, remove } = useFieldArray<Profile>('profiles')

onMounted(async () => {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const response = await ProfileService.getAllProfiles(token)

    if (response instanceof Error) {
      return //уведомление
    }

    profiles.value = response
  }
})

const inviteUsers = handleSubmit(async (values: TeamInviteRegisteredUsersForm) => {
  emit(
    'inviteRegisteredUsers',
    values.users.reduce<string[]>((emails, currentUser) => {
      emails.push(`${currentUser.userEmail}`)
      return emails
    }, []),
  )
})

const searchedOptions = computed(() => {
  const currentSearchedValue = searchedValue.value.trim().toLocaleLowerCase()
  return isSeachUsersBySkills.value
    ? getUsersBySearchedValue(currentSearchedValue)
    : profiles.value?.reduce<Profile[]>((allProfiles, profile) => {
        const currentOptionSearchingFields = `${profile.firstName} ${profile.lastName} ${profile.userEmail}`

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

function selectUser(profile: Profile, index: number) {
  profiles.value?.splice(
    profiles.value.findIndex(
      (currentProfile) => currentProfile.userId == profile.userId,
    ),
    1,
  )
  searchedOptions.value?.splice(index, 1)
  push(profile)
}

function unselectUser(profile: Profile, index: number) {
  searchedOptions.value?.push(profile)
  profiles.value?.push(profile)
  remove(index)
}

function getUsersBySearchedValue(searchedValue: string) {
  profiles.value?.reduce<Profile[]>((allProfiles, profile) => {
    const profileContainsSkill = profile.skills.find((skill) =>
      skill.name.trim().toLocaleLowerCase().includes(searchedValue),
    )

    if (profileContainsSkill) {
      allProfiles.push(profile)
    }

    return allProfiles
  }, [])
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
      v-if="isSeachUsersBySkills"
      @click="isSeachUsersBySkills = false"
      >Вернуть обычный поиск</Button
    >
    <Button
      v-else
      @click="isSeachUsersBySkills = true"
      >Рассширенный поиск</Button
    >

    <UsersColumns
      v-if="searchedOptions"
      :users="fields"
      :unselected-users="searchedOptions"
      v-model="searchedOptions"
      :display-by="['firstName', 'lastName']"
      :email="'userEmail'"
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
