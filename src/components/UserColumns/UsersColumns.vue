<script lang="ts" setup>
import { ref, computed } from 'vue'
import {
  UsersColumnsProps,
  UsersColumnsEmits,
} from '@Components/UserColumns/UsersColumns.types'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'

const props = defineProps<UsersColumnsProps>()
const emit = defineEmits<UsersColumnsEmits>()

const searchValueByUnselectedUsers = ref('')
const searchValueBySelectedUsers = ref('')

const searchedUnselectedUsers = computed(() => {
  if (searchValueByUnselectedUsers.value) {
    const currentSearchValue = searchValueByUnselectedUsers.value
      .toLowerCase()
      .trim()

    return props.unselectedUsers.filter(({ firstName, lastName }) => {
      const userName = `${firstName} ${lastName}`.toLowerCase().trim()

      return userName.includes(currentSearchValue)
    })
  }
  return props.unselectedUsers
})

const searchedSelectedUsers = computed(() => {
  if (searchValueBySelectedUsers.value) {
    const currentSearchValue = searchValueBySelectedUsers.value.toLowerCase().trim()

    return props.users.filter((user) => {
      const { firstName, lastName } = user.value
      const userName = `${firstName} ${lastName}`.toLowerCase().trim()

      return userName.includes(currentSearchValue)
    })
  }
  return props.users
})
</script>

<template>
  <div class="d-flex justify-content-between gap-3">
    <div class="users-column w-50">
      <Input
        name="searchByUnselectedUsers"
        class-name="rounded-end"
        :label="unselectedUsersLabel"
        placeholder="Найти"
        v-model="searchValueByUnselectedUsers"
      />

      <div
        class="users-column__unselected-users p-2 h-100 overflow-scroll border rounded-3"
      >
        <div
          class="users-column__user px-1 rounded border"
          v-for="(user, index) in searchedUnselectedUsers"
          :key="index"
          @click="emit('selectUser', user)"
        >
          <Typography>{{ user.firstName }} {{ user.lastName }}</Typography>
        </div>
      </div>
    </div>

    <div class="users-column w-50">
      <Input
        name="searchBySelectedUsers"
        class-name="rounded-end"
        :label="selectedUsersLabel"
        placeholder="Найти"
        v-model="searchValueBySelectedUsers"
      />

      <div
        class="users-column__selected-users p-2 h-100 overflow-scroll border rounded-3"
      >
        <div
          class="users-column__user px-1 rounded border"
          v-for="(user, index) in searchedSelectedUsers"
          :key="index"
          @click="emit('unselectUser', user.value, index)"
        >
          <Typography>
            {{ user.value.firstName }} {{ user.value.lastName }}
          </Typography>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.users-column {
  height: 220px;

  @include flexible(stretch, stretch, column, $gap: 8px);

  &__unselected-users,
  &__selected-users {
    @include flexible(stretch, flex-start, column, $gap: 8px);
  }

  &__user {
    cursor: pointer;

    &:hover {
      background-color: rgba($primary-color, 0.1);

      transition: background-color $default-transition-settings;
    }
  }
}
</style>
