<script lang="ts" setup>
import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import {
  GroupsListProps,
  GroupListEmits,
} from '@Components/Forms/UsersGroupsForm/UsersGroupsForm.types'

import RolesTypes from '@Domain/Roles'

import getRoles from '@Utils/getRoles'
import Icon from '@Components/Icon/Icon.vue'

defineProps<GroupsListProps>()
const emit = defineEmits<GroupListEmits>()

const groupRoles = getRoles()

function getCurrentRoleColor(role: RolesTypes) {
  if (role === 'ADMIN') {
    return 'text-danger'
  }
  return 'text-secondary'
}
</script>

<template>
  <div class="users-groups w-100">
    <template v-if="usersGroups">
      <div
        v-for="(group, index) in usersGroups"
        :key="index"
        class="users-groups__group px-3 py-2 border rounded-3"
      >
        <div class="col d-grid">
          <Typography class-name="text-primary fs-4">
            {{ group.name }}
          </Typography>

          <div class="d-flex gap-2">
            <Typography
              v-for="role in group.roles"
              :key="role"
              :class-name="`${getCurrentRoleColor(role)} fs-6`"
            >
              {{ groupRoles.translatedGroups[role] }}
            </Typography>
          </div>
        </div>

        <Icon
          class-name="users-groups__icon bi bi-pencil-square text-primary fs-5 me-2"
          @click="emit('openUpdatingGroupModal', group.id)"
        />
        <Icon
          class-name="users-groups__icon bi bi-trash-fill text-danger fs-5"
          @click="emit('openDeletingGroupModal', group.id)"
        />
      </div>
    </template>

    <LoadingPlaceholder
      v-else
      v-for="index in 3"
      :key="index"
      height="medium"
    />
  </div>
</template>

<style lang="scss" scoped>
.users-groups {
  height: 100vh;

  overflow-y: scroll;

  @include flexible(stretch, flex-start, column, $gap: 8px);

  &__group {
    @include flexible(space-between, center);
  }

  &__icon {
    cursor: pointer;
  }
}
</style>
