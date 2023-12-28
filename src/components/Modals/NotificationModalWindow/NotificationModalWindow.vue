<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import {
  NotificatonModalWindowEmits,
  NotificatonModalWindowProps,
} from '@Components/Modals/NotificationModalWindow/NotificationModalWindow.types'
import { SwitchTab } from '@Components/SwitchTabs/SwithTabs.types'
import FavouriteNotifications from '@Components/Modals/NotificationModalWindow/FavouriteNotifications.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import SwitchTabs from '@Components/SwitchTabs/SwithTabs.vue'
import UnreadedNotificationsModal from '@Components/Modals/NotificationModalWindow/UnreadedNotificationsModal.vue'
import ReadedNotificationsModal from '@Components/Modals/NotificationModalWindow/ReadedNotificationsModal.vue'
import NotificationTabsPlaceholder from '@Components/Modals/NotificationModalWindow/NotificationTabsPlaceholder.vue'
import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

defineProps<NotificatonModalWindowProps>()
const emit = defineEmits<NotificatonModalWindowEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const isAllTab = ref(true)
const isLoading = ref(false)

onMounted(async () => await getNotification(true))

async function getNotification(isAllNotifications: boolean) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const currentGetterKey = isAllNotifications
      ? 'fetchNotifications'
      : 'fetchFavouriteNotifications'

    isLoading.value = true
    await notificationsStore[currentGetterKey](token)
    isLoading.value = false
  }
}

async function switchTab(isAllNotifications: boolean) {
  isAllTab.value = isAllNotifications

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
    <div
      v-if="isOpened"
      class="notification-window-modal p-3 bg-white overflow-y-scroll"
    >
      <div class="w-100 d-flex justify-content-between">
        <Button
          class-name="col-2"
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

      <template v-if="!isLoading">
        <div
          v-if="isAllTab"
          class="w-100 d-flex flex-column gap-3"
        >
          <UnreadedNotificationsModal />

          <hr class="my-0 hr hr-blurry" />

          <ReadedNotificationsModal />
        </div>

        <FavouriteNotifications v-else />
      </template>

      <NotificationTabsPlaceholder v-else />
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
