<script lang="ts" setup>
import { ref, toRefs, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import Button from '@Components/Button/Button.vue'
import { NotificationModalProps } from '@Components/Modals/NotificationModal/NotificationModal.types'
import Typography from '@Components/Typography/Typography.vue'

import useNotificationsStore from '@Store/notifications/notificationsStore'

const notificationStore = useNotificationsStore()
const { unreadedNotifications } = storeToRefs(notificationStore)

const props = defineProps<NotificationModalProps>()
const { id, type, message } = toRefs(props.notification)

const isUnreadedNotification = ref(
  !!unreadedNotifications.value.find((notification) => notification.id === id.value),
)

onMounted(() => {
  if (isUnreadedNotification.value && props.timeExpired) {
    setTimeout(() => closeNotification(), props.timeExpired)
  }
})

const NotificationClassName = computed(() => {
  switch (type?.value) {
    case 'success':
      return ['card text-success shadow']
    case 'error':
      return ['card text-danger shadow']
    default:
      return ['card text-primary shadow']
  }
})

function closeNotification() {
  notificationStore.readNotification(id.value)
}
</script>

<template>
  <Teleport to="#notifications">
    <Transition name="notification-modal">
      <div
        v-if="isUnreadedNotification"
        :class="NotificationClassName"
      >
        <div class="card-header">
          <Typography>Уведомление</Typography>

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
