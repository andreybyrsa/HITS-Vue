<script lang="ts" setup generic="User">
import Typography from '@Components/Typography/Typography.vue'
import {
  UsersColumnsProps,
  UsersColumnsEmits,
} from '@Components/UserColumns/UsersColumns.types'

defineModel<User | User[]>({
  required: false,
})

const props = defineProps<UsersColumnsProps<User>>()
const emit = defineEmits<UsersColumnsEmits<User>>()

function displayByUserField(user: User) {
  return props.displayBy.reduce(
    (prevValue, value) => (prevValue += `${user[value]} `),
    '',
  )
}
</script>

<template>
  <div class="d-flex justify-content-between gap-3">
    <div class="users-column w-50">
      <Typography class-name="text-primary">Невыбранные пользователи:</Typography>

      <div
        class="users-column__unselected-users p-2 h-100 overflow-scroll border rounded-3"
      >
        <div
          v-for="(user, index) in unselectedUsers"
          :key="index"
          class="users-column__user px-1 rounded border"
        >
          <Typography
            class="w-100"
            @click="emit('onSelect', user, index)"
            >{{ displayByUserField(user) }}</Typography
          >
        </div>
      </div>
    </div>

    <div class="users-column w-50">
      <Typography class-name="text-primary">Выбранные пользователи:</Typography>

      <div
        class="users-column__selected-users p-2 h-100 overflow-scroll border rounded-3"
      >
        <div
          class="users-column__user px-1 rounded border"
          v-for="(user, index) in users"
          :key="index"
          @click="emit('onUnselect', user.value, index)"
        >
          <Typography> {{ displayByUserField(user.value) }} </Typography>
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
    @include flexible(stretch, flex-start, $gap: 8px);

    &:hover {
      background-color: rgba($primary-color, 0.1);

      transition: background-color $default-transition-settings;
    }
  }

  &__button {
    @include position(absolute, $top: 11px, $right: 12px, $z-index: 10);

    cursor: pointer;
  }
}
</style>
