<script lang="ts" setup>
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import {
  UsersListProps,
  UsersListEmits,
} from '@Components/Forms/EditUsersForm/EditUsersForm.types'

import RolesTypes from '@Domain/Roles'

import getRoles from '@Utils/getRoles'

defineProps<UsersListProps>()

const emit = defineEmits<UsersListEmits>()

const availableRoles = getRoles()

function getCurrentRoleColor(role: RolesTypes) {
  if (role === 'ADMIN') {
    return 'text-danger'
  }
  return 'text-secondary'
}
</script>

<template>
  <div
    v-for="(user, index) in searchedUsers"
    :key="index"
    class="user px-3 py-2 border rounded-3"
  >
    <div class="d-flex flex-column">
      <Typography class-name="text-primary fs-5">
        {{ user.email }}
      </Typography>
      <Typography>{{ user.firstName }} {{ user.lastName }}</Typography>

      <div class="user__roles">
        <Typography
          v-for="(role, index) in user.roles"
          :key="index"
          :class-name="`fs-6 ${getCurrentRoleColor(role)}`"
        >
          {{ availableRoles.translatedRoles[role] }}
        </Typography>
      </div>
    </div>

    <Button
      prepend-icon-name="bi bi-pencil-square text-primary"
      @click="emit('open-edit-modal', user.email)"
    ></Button>
  </div>
</template>

<style lang="scss" scoped>
.user {
  @include flexible(center, space-between);

  &__roles {
    @include flexible(center, flex-start, $gap: 8px);
  }
}
</style>
