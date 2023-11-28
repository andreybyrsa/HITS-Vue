<template>
  <div class="selected-users border rounded-4">
    <div class="d-flex gap-3 flex-wrap">
      <div
        v-for="(user, index) in selectedUsers"
        :key="index"
        class="selected-users__element p-1 rounded-3 bg-primary bg-opacity-25"
      >
        <div>
          {{ user.firstName }}
          {{ user.lastName }}
        </div>

        <Button
          prepend-icon-name="bi bi-x-lg fs-6"
          class-name="p-0"
          @click="removeUserFromParent(user)"
        ></Button>
      </div>
    </div>

    <div v-if="selectedUsers?.length === 0">
      <Typography class-name="text-secondary">Никто не выбран</Typography>
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
import Typography from '@Components/Typography/Typography.vue'

const selectedUsers = inject<User[]>('selectedUsers')

const emits = defineEmits(['removeUser'])

const removeUserFromParent = (user: User) => {
  emits('removeUser', user)
}
</script>

<style lang="scss" scoped>
.selected-users {
  width: 100%;
  padding: 16px;
  @include flexible(center, space-between, $gap: 16px);

  &__element {
    width: fit-content;
    @include flexible(center, center, $gap: 4px);
  }
}
</style>
