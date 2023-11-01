<script lang="ts" setup>
import { toRefs, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import NotificationModalProps from '@Components/Modals/NotificationModal/NotificationModal.types'
import Typography from '@Components/Typography/Typography.vue'

import useNotificationsStore from '@Store/notifications/notificationsStore'

const notificationStore = useNotificationsStore()
const { notifications } = storeToRefs(notificationStore)

const props = defineProps<NotificationModalProps>()
const { id, message } = toRefs(props.notification)

onMounted(() => {
  if (props.timeExpired) {
    setTimeout(() => closeNotification(), props.timeExpired)
  }
})

const NotificationClassName = computed(() => ['card text-primary shadow'])

function closeNotification() {
  notificationStore.closeNotification(id.value)
}
</script>

<template>
  <Teleport to="#notifications">
    <Transition name="notification-modal">
      <div
        v-if="notifications"
        :class="NotificationClassName"
      >
        <div class="card-header">
          <Typography>{{ notification.title }}</Typography>

          <Button
            class-name="btn-close"
            @click="closeNotification"
          ></Button>
        </div>

        <div class="card-body">
          {{ message }}
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
