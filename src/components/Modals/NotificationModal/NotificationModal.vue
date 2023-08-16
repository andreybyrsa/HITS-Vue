<script lang="ts" setup>
import { computed, watch } from 'vue'

import Button from '@Components/Button/Button.vue'
import {
  NotificationModalProps,
  NotificationModalEmits,
} from '@Components/Modals/NotificationModal/NotificationModal.types'
import Typography from '@Components/Typography/Typography.vue'

const props = defineProps<NotificationModalProps>()

const emit = defineEmits<NotificationModalEmits>()

const NotificationClassName = computed(() => {
  switch (props.type) {
    case 'success':
      return ['card text-success shadow']
    case 'error':
      return ['card text-danger shadow']
    default:
      return ['card text-primary shadow']
  }
})

watch(
  () => props.isOpened,
  () => {
    if (props.isOpened && props.timeExpired) {
      setTimeout(() => emit('close-modal'), props.timeExpired)
    }
  },
)
</script>

<template>
  <Teleport to="#notifications">
    <Transition name="notification-modal">
      <div
        v-if="isOpened"
        :class="NotificationClassName"
      >
        <div class="card-header">
          <Typography>Уведомление</Typography>

          <Button
            class-name="btn-close"
            @click="emit('close-modal')"
          ></Button>
        </div>

        <div class="card-body">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.card {
  width: 400px;
  height: min-content;

  transition: opacity $default-transition-settings;

  &-header {
    @include flexible(center, space-between);
  }
}

.notification-modal-enter-from {
  opacity: 0;
}

.notification-modal-leave-to {
  opacity: 0;
}
</style>
