<script lang="ts" setup>
import { computed } from 'vue'

import { NotificationModalProps } from '@Components/NotificationElement/NotificationElement.types'
import Typography from '@Components/Typography/Typography.vue'

const props = defineProps<NotificationModalProps>()

const NotificationClassName = computed(() => {
  switch (props.text) {
    case 'green':
      return ['card text-success shadow']
    case 'red':
      return ['card text-danger shadow']
    default:
      return ['card shadow']
  }
})

const NotificationHeader = computed(() => {
  switch (props.type) {
    case 'personal':
      return 'Персональное'
    case 'ideas':
      return 'Идеи'
    case 'system':
      return 'Система'
    default:
      return 'Изменение'
  }
})
</script>

<template>
  <Transition name="notification-modal">
    <div :class="NotificationClassName">
      <div class="card-header">
        <Typography class-name="text-light">{{
          NotificationHeader
        }}</Typography>
        <Typography class-name="text-white-50 fs-6">{{ date }}</Typography>
      </div>

      <div class="card-body">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: min-content;
  margin: 16px;

  transition: opacity $default-transition-settings;

  &-header {
    @include flexible(center, space-between);
    background-color: #0d6efd;
  }
}

.notification-modal-enter-from {
  opacity: 0;
}

.notification-modal-leave-to {
  opacity: 0;
}
</style>
