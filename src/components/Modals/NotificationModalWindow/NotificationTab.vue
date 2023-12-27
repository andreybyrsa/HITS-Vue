<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'

import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import {
  NotificationTabProps,
  NotificationTabEmits,
} from '@Components/Modals/NotificationModalWindow/NotificationModalWindow.types'

defineProps<NotificationTabProps>()
const emit = defineEmits<NotificationTabEmits>()

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'HH:MM DD.MM.YYYY')
    return formattedDate.value
  }
}
</script>

<template>
  <div class="notification-tab w-100 border border-primary bg-white rounded-3 p-2">
    <div class="w-100 pb-2 d-flex flex-column gap-1 border-bottom">
      <div class="w-100 d-flex gap-3 justify-content-between align-items-start">
        <Typography class-name="fw-bold">{{ notification.title }}</Typography>

        <div class="notification-tab__date d-flex gap-2">
          <Typography class-name="text-secondary">
            {{ getFormattedDate(notification.createdAt) }}
          </Typography>

          <Icon
            v-if="isFavourite"
            class-name="bi bi-bookmark-fill fs-5 text-warning cursor-pointer"
            @click="emit('icon-click', notification)"
          />
          <Icon
            v-else
            class-name="bi bi-bookmark fs-5 text-warning cursor-pointer"
            @click="emit('icon-click', notification)"
          />
        </div>
      </div>
    </div>

    <div class="w-100 pt-2">
      <Typography>{{ notification.message }}</Typography>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notification-tab {
  &__date {
    @include fixedWidth(150px);
  }
}
</style>
