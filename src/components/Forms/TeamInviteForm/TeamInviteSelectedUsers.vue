<template>
  <div class="selected-users border rounded-4">
    <div class="d-flex gap-3 flex-wrap">
      <div
        v-for="(user, index) in selectedUsers"
        :key="index"
        class="selected-users__element bg-light rounded-pill border p-1"
      >
        <div>
          {{ user.firstName }}
          {{ user.lastName }}
        </div>

        <Button
          prepend-icon-name="bi bi-x-lg"
          class-name="p-0"
          @click="removeUserFromParent(user)"
        ></Button>
      </div>
    </div>
    <div>
      <Button class-name="btn-success">Принять</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { User } from '@Domain/User'
import Button from '@Components/Button/Button.vue'

const selectedUsers = inject<User[]>('selectedUsers')

const emits = defineEmits(['removeUser'])

const removeUserFromParent = (user: User) => {
  emits('removeUser', user)
}
</script>

<style lang="scss" scoped>
.selected-users {
  width: 100%;
  padding: 32px;
  @include flexible(center, space-between, $gap: 16px);

  &__element {
    width: fit-content;
    @include flexible(center, start, $gap: 8px);
  }
}
</style>
