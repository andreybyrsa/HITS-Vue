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

import Notification from '@Domain/Notification'
import Button from '@Components/Button/Button.vue'

import NotificatonsService from '@Services/NotificationService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import { useDateFormat } from '@vueuse/core'
import { SwitchTab } from '@Components/SwitchTabs/SwithTabs.types'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()
const { notifications } = storeToRefs(notificationsStore)

defineProps<NotificatonModalWindowProps>()

const emit = defineEmits<NotificatonModalWindowEmits>()

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

const removeFromFavorites = async (id: string, index: number) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const response = await NotificatonsService.unMarkAsFavoriteNotification(
      id,
      token,
    )

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    notifications.value.forEach((notification) => {
      if (notification.id === id) {
        favoriteNotifications.value.splice(index, 1)
        notification.isFavourite = false
      }
    })
  }
}

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
    <div
      class="notification-window-modal p-3 bg-white rounded-3 h-100 overflow-y-scroll"
    >
      <div class="notification-window-modal__top-btn w-100">
        <Button
          variant="primary"
          prepend-icon-name="bi bi-backspace-fill"
          @click="emit('close-modal')"
        >
          Назад
        </Button>
        <div class="fs-4 text-primary p-2 w-100 border rounded w-100">
          Уведомления
        </div>
      </div>

      <SwitchTabs :tabs="tabs" />

      <div class="notification-window-modal__header">
        <div v-if="showAllTab">
          <div v-if="hasNewNotifications">
            <UnreadedNotificationsModal />
          </div>

          <div v-if="notifications">
            <ReadedNotificationsModal />
          </div>
        </div>

        <div v-else>
          <div v-if="hasFavoriteNotifications">
            <div
              class="notification-window-modal__notification mx-4"
              v-for="(notification, index) in favoriteNotifications"
              :key="notification.id"
            >
              <div v-if="notifications">
                <div
                  class="notification-window-modal__title text-wrap row border border-primary bg-white rounded-3 p-2 mb-4"
                >
                  <div class-name="row">
                    <Typography class-name="fs-6 text-black col">{{
                      getFormattedDate(notification.createdAt)
                    }}</Typography>
                    <Button
                      class="notification-window-modal__check-btn text-white col-1 float-end"
                      prepend-icon-name="bi bi-star-fill text-primary"
                      @click="removeFromFavorites(notification.id, index)"
                    ></Button>
                  </div>
                  <Typography class-name="fs-6 text-black w-50 fw-bold col-2">
                    {{ notification.title }}
                  </Typography>

                  <Typography class-name="fs-6 text-black">{{
                    notification.message
                  }}</Typography>
                </div>
              </div>
              <LoadingPlaceholder v-else />
            </div>
          </div>
          <div v-else>
            <Typography
              class="notification-window-modal__empty-favorites p-5 text-secondary fs-4 text-wrap"
            >
              Добавляйте в закладки важные уведомления — нажмите на знак звёздочки
            </Typography>
          </div>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.notification-window-modal {
  width: 50%;
  justify-self: end;
  &__check-btn {
    @include flexible(flex-start, flex-end);
    width: 5%;
    font-size: 60%;
  }
  &__header-unread {
    @include flexible(start, space-between);
  }
  &__title {
    display: flex;
    align-items: center;
  }

  &__top-btn {
    @include flexible(stretch, flex-start, $gap: 16px);
  }
  &__pages-headers {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  &__empty-favorites {
    width: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
  }
  &__favorite-btn {
    @include flexible(flex-start, flex-end);
    width: 5%;
    font-size: 60%;
  }
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgb(209, 209, 209);
  border-radius: 20px;
}

::-webkit-scrollbar-thumb {
  background-color: #0d6efd;
  border-radius: 20px;
  border: 3px solid #0d6efd;
}
</style>
