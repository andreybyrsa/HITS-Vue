<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useFieldArray, useForm } from 'vee-validate'

import ManageUsersService from '@Services/ManageUsersService'
import useUserStore from '@Store/user/userStore'
import { User } from '@Domain/User'

import UsersColumns from '@Components/UserColumns/UsersColumns.vue'
import {
  InviteRegisteredUsersForm,
  InviteRegisteredUsersProps,
  InviteRegisteredUsersEmits,
} from '@Components/Modals/InviteModal/InviteModal.types'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'

defineProps<InviteRegisteredUsersProps>()

const emit = defineEmits<InviteRegisteredUsersEmits>()

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const searchedValue = ref('')

const unselectedUsers = ref<User[]>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const response = await ManageUsersService.getUsers(token)

    if (response instanceof Error) {
      return
    }
    unselectedUsers.value = response
  }
})

const { handleSubmit } = useForm<InviteRegisteredUsersForm>({
  validationSchema: {
    users: (value: User[]) => value?.length > 0 || 'Выберите пользователей',
  },
})

const { fields, push, remove } = useFieldArray<User>('users')

const inviteUsers = handleSubmit(async (values) => {
  emit('inviteRegisteredUsers', values.users)
})

const searchedUsers = computed(() => {
  if (unselectedUsers.value) {
    const currentSearchedValue = searchedValue.value.trim().toLocaleLowerCase()

    return unselectedUsers.value.reduce<User[]>((users, user) => {
      const currentUserFields = `${user.firstName} ${user.lastName} ${user.email}`
      const isIncludesSeachedValue = currentUserFields
        .trim()
        .toLocaleLowerCase()
        .includes(currentSearchedValue)

      if (isIncludesSeachedValue) {
        users.push(user)
      }

      return users
    }, [])
  }
  return []
})

function selectUser(user: User, index: number) {
  if (unselectedUsers.value) {
    push(user)
    unselectedUsers.value.splice(index, 1)
  }
}

function unselectUser(user: User, index: number) {
  if (unselectedUsers.value) {
    remove(index)
    unselectedUsers.value.push(user)
  }
}
</script>
<template>
  <div
    v-if="unselectedUsers"
    class="invite-registered h-100"
  >
    <Input
      :name="`search-${name}`"
      class-name="rounded-end"
      v-model="searchedValue"
      no-form-controlled
      placeholder="Найти пользователя"
    />
    <UsersColumns
      :users="fields"
      :unselected-users="searchedUsers"
      :advanced-info="advancedInfo"
      @select-user="selectUser"
      @unselect-user="unselectUser"
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
