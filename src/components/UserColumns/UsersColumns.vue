<script lang="ts" setup>
import Typography from '@Components/Typography/Typography.vue'
import {
  UsersColumnsProps,
  UsersColumnsEmits,
} from '@Components/UserColumns/UsersColumns.types'
import Icon from '@Components/Icon/Icon.vue'
import DropDown from '@Components/DropDown/DropDown.vue'

defineProps<UsersColumnsProps>()
const emit = defineEmits<UsersColumnsEmits>()
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
          <DropDown
            v-if="advancedInfo"
            :id="user.id"
          >
            <div>{{ user[advancedInfo] }}</div></DropDown
          >
          <Icon
            v-if="advancedInfo"
            class-name="bi bi-chevron-down"
            v-dropdown="user.id"
          />
          <Typography
            v-tooltip="user.email"
            @click="emit('selectUser', user, index)"
            >{{ user.lastName }} {{ user.firstName }}</Typography
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
          @click="emit('unselectUser', user.value, index)"
        >
          <Typography v-tooltip="user.value.email">
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
