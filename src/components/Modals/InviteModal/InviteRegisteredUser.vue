<script lang="ts" setup generic="User">
import { computed, ref } from 'vue'
import { useFieldArray, useForm } from 'vee-validate'

import UsersColumns from '@Components/UserColumns/UsersColumns.vue'
import {
  InviteRegisteredUsersProps,
  InviteRegisteredUsersEmits,
} from '@Components/Modals/InviteModal/InviteModal.types'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Icon from '@Components/Icon/Icon.vue'

defineModel<User | User[]>({
  required: false,
})

const props = defineProps<InviteRegisteredUsersProps<User>>()

const emit = defineEmits<InviteRegisteredUsersEmits<User>>()

const searchedValue = ref('')

const isSeachedByAdvancedField = ref<boolean>(false)

const unselectedUsers = ref<User[]>()

const { handleSubmit } = useForm<any>({
  validationSchema: {
    users: (value: User[]) => value?.length > 0 || 'Выберите пользователей',
  },
})

const { fields, push, remove } = useFieldArray<User>('users')

const inviteUsers = handleSubmit(async (values: User[]) => {
  emit(
    'inviteRegisteredUsers',
    values.reduce<string[]>((emails, currentUser) => {
      emails.push(`${currentUser[props.email]}`)
      return emails
    }, []),
  )
})

const searchedOptions = computed(() => {
  const currentSearchedValue = searchedValue.value.trim().toLocaleLowerCase()

  return isSeachedByAdvancedField.value
    ? emit('searchByAdvacnedField', props.users, searchedValue.value)
    : props.users.reduce<User[]>((optionsArray, user) => {
        const currentOptionSearchingFields =
          props.displayBy.reduce(
            (prevValue, value) => (prevValue += `${user[value]} `),
            '',
          ) + `${user[props.email]}`

        const isIncludesSeachedValue = currentOptionSearchingFields
          .trim()
          .toLocaleLowerCase()
          .includes(currentSearchedValue)

        if (isIncludesSeachedValue) {
          optionsArray.push(user)
        }

        return optionsArray
      }, [])
})

function selectUser(user: User, index: number) {
  if (unselectedUsers.value) {
    push(user)
    unselectedUsers.value.splice(index, 1)
  }
}

function unselectUser(user: User, index: number) {
  if (unselectedUsers.value) {
    unselectedUsers.value.push(user)
    remove(index)
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
    <Icon
      v-if="isSeachedByAdvancedField"
      class-name="invite-registered__icon"
      v-tooltip="'Вернуть обычный поиск'"
      @click="isSeachedByAdvancedField = false"
    />
    <Button
      v-if="isAdvancedSearch && !isSeachedByAdvancedField"
      @click="isSeachedByAdvancedField = true"
      >Рассширенный поиск</Button
    >
    <UsersColumns
      :users="fields"
      :unselected-users="searchedOptions"
      :display-by="displayBy"
      :email="(email as keyof User)"
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

  &__icon {
    @include position(absolute, $top: 11px, $right: 12px, $z-index: 5);

    cursor: pointer;
  }
}
</style>
