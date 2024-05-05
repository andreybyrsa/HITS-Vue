<script lang="ts" setup>
import {
  SprintInfoHeaderProps,
  SprintInfoModalEmits,
} from '@Components/Modals/SprintInfoModal/SprintInfoModal.types'

import Button from '@Components/Button/Button.vue'

defineProps<SprintInfoHeaderProps>()
const emit = defineEmits<SprintInfoModalEmits>()
</script>

<template>
  <div class="sprint-header w-100">
    <div class="sprint-header__name fs-4 text-primary w-100">{{ sprintName }}</div>
    <Button
      variant="close"
      @click="emit('close-modal')"
    />
  </div>
</template>

<style lang="scss" scoped>
.sprint-header {
  @include flexible(center, space-between);

  &__name {
    @include textEllipsis(1);
  }
}
</style>
