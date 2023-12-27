<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import {
  NotificatonModalWindowEmits,
  NotificatonModalWindowProps,
} from '@Components/Modals/NotificationModalWindow/NotificationModalWindow.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import SwitchTabs from '@Components/SwitchTabs/SwithTabs.vue'
import UnreadedNotificationsModal from '@Components/Modals/NotificationModalWindow/UnreadedNotificationsModal.vue'
import ReadedNotificationsModal from '@Components/Modals/NotificationModalWindow/ReadedNotificationsModal.vue'

import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { SwitchTab } from '@Components/SwitchTabs/SwithTabs.types'
import FavouriteNotifications from './FavouriteNotifications.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()
const { notifications } = storeToRefs(notificationsStore)

defineProps<NotificatonModalWindowProps>()

const emit = defineEmits<NotificatonModalWindowEmits>()

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    await notificationsStore.getNotifications(token)
  }
})

const showAllTab = ref(true)

const hasNewNotifications = computed(() => notifications.value.length > 0)

async function getNotification(isAllNotifications: boolean) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const currentGetterKey = isAllNotifications
      ? 'getNotifications'
      : 'getFavouriteNotifications'

    await notificationsStore[currentGetterKey](token)
  }
}

async function switchTab(isAllNotifications: boolean) {
  showAllTab.value = isAllNotifications

  await getNotification(isAllNotifications)
}

const tabs: SwitchTab[] = [
  {
    id: '0',
    label: 'Все',
    click: () => switchTab(true),
  },
  {
    id: '1',
    label: 'Избранное',
    click: () => switchTab(false),
  },
]
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="notification-window-modal p-3 bg-white overflow-y-scroll">
      <div class="w-100 d-flex justify-content-between">
        <Button
          variant="primary"
          prepend-icon-name="bi bi-backspace-fill"
          @click="emit('close-modal')"
        >
          Назад
        </Button>
        <Typography class-name="text-center fs-3 text-primary">
          Уведомления
        </Typography>
        <div class="col-2"></div>
      </div>

      <SwitchTabs :tabs="tabs" />

      <div
        v-if="showAllTab"
        class="notification-window-modal__header w-100"
      >
        <div v-if="hasNewNotifications">
          <UnreadedNotificationsModal />
        </div>

        <div v-if="notifications">
          <ReadedNotificationsModal />
        </div>
      </div>

      <FavouriteNotifications v-else />
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.notification-window-modal {
  width: 50%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;

  @include flexible(
    $flex-direction: column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;
}

.modal-layout-enter-from .notification-window-modal,
.modal-layout-leave-to .notification-window-modal {
  transform: translateX(100%);
}
</style>
