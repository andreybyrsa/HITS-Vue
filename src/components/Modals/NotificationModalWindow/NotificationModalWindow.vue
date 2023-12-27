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

import Notification from '@Domain/Notification'
import Button from '@Components/Button/Button.vue'

import NotificatonsService from '@Services/NotificationService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import { useDateFormat } from '@vueuse/core'
import Icon from '@Components/Icon/Icon.vue'
import { SwitchTab } from '@Components/SwitchTabs/SwithTabs.types'
import FavouriteNotifications from './FavouriteNotifications.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()
const { notifications } = storeToRefs(notificationsStore)

defineProps<NotificatonModalWindowProps>()

const emit = defineEmits<NotificatonModalWindowEmits>()

const readedNotifications = ref<Notification[]>([])
const unreadNotifications = ref<Notification[]>([])

const favoriteNotifications = ref<Notification[]>([])

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    await notificationsStore.getNotifications(token)
  }
})

const showAllTab = ref(true)

const hasNewNotifications = computed(() => notifications.value.length > 0)

const hasFavoriteNotifications = computed(
  () => favoriteNotifications.value.length > 0,
)
const switchTabToShow = (isAll: boolean) => {
  showAllTab.value = isAll
}

const markAllAsRead = async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await NotificatonsService.readAllNotifications(token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    unreadNotifications.value.forEach((notification) => {
      notification.isReaded = true
      readedNotifications.value.push(notification)
    })
    unreadNotifications.value = []
  }
}

const markAsRead = async (id: string, index: number) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await NotificatonsService.readNotification(id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    notifications.value.forEach((notification) => {
      if (notification.id === id) {
        unreadNotifications.value.splice(index, 1)
        readedNotifications.value.push(notification)
      }
    })
  }
}

const addToFavorites = async (id: string, index: number) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await NotificatonsService.markAsFavoriteNotification(id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    notifications.value.forEach((notification) => {
      if (notification.id === id) {
        if (notification.isReaded === false) {
          unreadNotifications.value.splice(index, 1)
          readedNotifications.value.unshift(notification)
        }

        favoriteNotifications.value.push(notification)
        notification.isFavourite = true
      }
    })
  }
}

// const removeAllFromFavorites = () => {
//   favoriteNotifications.value.forEach((notification) => {
//     notification.isFavourite = false
//   })
//   favoriteNotifications.value = []
// }

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'HH:MM DD.MM.YYYY')
    return formattedDate.value
  }
}

const tabs: SwitchTab[] = [
  {
    id: '0',
    label: 'Все',
    click: () => switchTabToShow(true),
  },
  {
    id: '1',
    label: 'Избранное',
    click: () => switchTabToShow(false),
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

      <div v-if="showAllTab">
        <div v-if="hasNewNotifications">
          <UnreadedNotificationsModal />

          <hr class="hr hr-blurry" />
        </div>
        <div v-if="notifications">
          <Typography class-name="fs-5 text-primary text-wrap">Прочитано</Typography>

          <div
            v-for="(notification, index) in readedNotifications"
            :key="notification.id"
            class="notification-window-modal__notification p-2 mb-2"
          >
            <div
              v-if="notifications"
              class="bg-white border border-primary rounded-3 p-2"
            >
              <div class="notification-window-modal__title text-wrap row">
                <div class-name="row">
                  <Typography class-name="fs-6 text-black col">
                    {{ getFormattedDate(notification.createdAt) }}
                  </Typography>
                  <Button
                    class="notification-window-modal__favorite-btn text-primary col float-end"
                    v-if="notification.isFavourite === false"
                    prepend-icon-name="bi bi-star"
                    @click="addToFavorites(notification.id, index)"
                  ></Button>
                  <Button
                    class="notification-window-modal__favorite-btn text-primary col float-end"
                    v-else
                    prepend-icon-name="bi bi-star-fill"
                    @click="removeFromFavorites(notification.id, index)"
                  ></Button>
                </div>
                <Typography class-name="fs-6 text-black w-50 fw-bold col-2">
                  {{ notification.title }}
                </Typography>
              </div>
              <Typography class-name="fs-6 text-black">{{
                notification.message
              }}</Typography>
            </div>
            <LoadingPlaceholder v-else />
          </div>
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
