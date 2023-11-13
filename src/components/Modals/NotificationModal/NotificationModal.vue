<script lang="ts" setup>
import { computed, onMounted } from 'vue'

import Button from '@Components/Button/Button.vue'
import {
  NotificationModalProps,
  NotificationModalEmits,
} from '@Components/Modals/NotificationModal/NotificationModal.types'
import Typography from '@Components/Typography/Typography.vue'

const props = defineProps<NotificationModalProps>()
const emits = defineEmits<NotificationModalEmits>()

onMounted(() => {
  if (props.timeExpired) {
    setTimeout(
      () => emits('close-notification', props.notification),
      props.timeExpired,
    )
  }
})

const NotificationClassName = computed(() => ['card', 'text-primary'])
</script>

<template>
  <Teleport to="#notifications">
    <Transition
      name="notification-modal"
      appear
    >
      <div
        v-if="!notification.isShowed"
        :class="NotificationClassName"
      >
        <div class="card-header">
          <Typography>{{ notification.title }}</Typography>

          <Button
            variant="close"
            @click="emits('close-notification', props.notification)"
          ></Button>
        </div>

        <div class="card-body">
          {{ notification.message }}
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

.notification-modal-enter-from,
.notification-modal-leave-to {
  opacity: 0;
}
</style>
