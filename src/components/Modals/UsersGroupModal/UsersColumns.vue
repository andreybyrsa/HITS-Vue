<script lang="ts" setup>
import Typography from '@Components/Typography/Typography.vue'
import {
  UsersColumnsProps,
  UsersColumnsEmits,
} from '@Components/Modals/UsersGroupModal/UsersGroupModal.types'

defineProps<UsersColumnsProps>()
const emit = defineEmits<UsersColumnsEmits>()
</script>

<template>
  <div class="d-flex justify-content-between gap-3">
    <div class="users-column w-50">
      <Typography class-name="text-primary">Пользователи не в группе:</Typography>

      <div
        class="users-column__unselected-users p-2 h-100 overflow-scroll border rounded-3"
      >
        <div
          class="users-column__user px-1 rounded border"
          v-for="(user, index) in unselectedUsers"
          :key="index"
          @click="emit('selectUser', user, index)"
        >
          <Typography>{{ user.lastName }} {{ user.firstName }}</Typography>
        </div>
      </div>
    </div>

    <div class="users-column w-50">
      <Typography class-name="text-primary">Пользователи в группе:</Typography>

      <div
        class="users-column__selected-users p-2 h-100 overflow-scroll border rounded-3"
      >
        <div
          class="users-column__user px-1 rounded border"
          v-for="(user, index) in users"
          :key="index"
          @click="emit('unselectUser', user.value, index)"
        >
          <Typography>
            {{ user.value.lastName }} {{ user.value.firstName }}
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
