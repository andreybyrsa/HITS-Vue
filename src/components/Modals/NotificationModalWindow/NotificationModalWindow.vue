<!-- eslint-disable vue/valid-v-else -->
<script lang="ts" setup>
import { Ref, ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import {
  NotificatonModalWindowEmits,
  NotificatonModalWindowProps,
} from '@Components/Modals/NotificationModalWindow/NotificationModalWindow.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'

import Notification from '@Domain/Notification'
import Button from '@Components/Button/Button.vue'

import NotificatonsService from '@Services/NotificationService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import { RequestResult, makeParallelRequests } from '@Utils/makeParallelRequests'
import { useDateFormat } from '@vueuse/core'

const notificationsStore = useNotificationsStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const NotificationsStore = useNotificationsStore()
const { notifications } = storeToRefs(NotificationsStore)

defineProps<NotificatonModalWindowProps>()

const emit = defineEmits<NotificatonModalWindowEmits>()

const readedNotifications = ref<Notification[]>([])

const favoriteNotifications = ref<Notification[]>([])

function checkResponseStatus<T>(
  data: RequestResult<T>,
  refValue: Ref<T | undefined>,
) {
  if (data.status === 'fulfilled') {
    refValue.value = data.value
  } else {
    notificationsStore.createSystemNotification('Система', `${data.value}`)
  }
}

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const profileParallelRequests = [
      () => NotificatonsService.getNotifications(token),
      () => NotificatonsService.getFavoriteNotifications(token),
    ]

    await makeParallelRequests<Notification[] | Error>(profileParallelRequests).then(
      (responses) => {
        responses.forEach((response) => {
          if (response.id === 0) {
            checkResponseStatus(response, notifications)
          } else if (response.id === 1) {
            checkResponseStatus(response, favoriteNotifications)
          }
        })
      },
    )
  }

  for (const notification of notifications.value) {
    if (notification.isReaded === false) {
      notifications.value.push(notification)
    } else {
      readedNotifications.value.push(notification)
    }
  }
})

const showAllTab = ref(true)

const hasNewNotifications = computed(() => notifications.value.length > 0)

const hasFavoriteNotifications = computed(
  () => favoriteNotifications.value.length > 0,
)
const switchTabToShow = (tab: any) => {
  showAllTab.value = tab === 'all'
}

const markAllAsRead = () => {
  notifications.value.forEach((notification) => {
    notification.isReaded = true
    readedNotifications.value.unshift(notification)
  })
  notifications.value = []
}

const markAsRead = async () => {
  const currentUser = user.value
  const currentNotification = notifications.value

  if (currentUser?.token && currentNotification) {
    const { token } = currentUser

    for (const notification of currentNotification) {
      const { id } = notification

      const response = await NotificatonsService.checkNotification(id, token)

      if (response instanceof Error) {
        return NotificationsStore.createSystemNotification(
          'Система',
          response.message,
        )
      }

      readedNotifications.value.unshift(notification)
    }
  }
}

const addToFavorites = async () => {
  const currentUser = user.value
  const currentNotification = notifications.value

  if (currentUser?.token && currentNotification) {
    const { token } = currentUser

    for (const notification of currentNotification) {
      const { id } = notification

      const response = await NotificatonsService.markAsFavoriteNotification(
        id,
        token,
      )

      if (response instanceof Error) {
        return NotificationsStore.createSystemNotification(
          'Система',
          response.message,
        )
      }
      console.log(notification)
      readedNotifications.value.unshift(notification)
      favoriteNotifications.value.push(notification)
    }
  }
}

const removeFromFavorites = async () => {
  const currentUser = user.value
  const currentNotification = notifications.value

  if (currentUser?.token && currentNotification) {
    const { token } = currentUser

    for (const notification of currentNotification) {
      const { id } = notification

      const response = await NotificatonsService.unMarkAsFavoriteNotification(
        id,
        token,
      )

      if (response instanceof Error) {
        return NotificationsStore.createSystemNotification(
          'Система',
          response.message,
        )
      }

      readedNotifications.value.unshift(notification)
    }
  }
}

const removeAllFromFavorites = () => {
  favoriteNotifications.value.forEach((notification) => {
    notification.isFavourite = false
  })
  favoriteNotifications.value = []
}

function getFormattedDate(date: Date) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'HH:MM DD.MM.YYYY')
    return formattedDate.value
  }
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div
      class="notification-window-modal p-3 bg-white rounded-3 h-100 overflow-y-scroll"
    >
      <div class="notification-window-modal__top-btn">
        <Button
          variant="primary"
          class-name="mb-3"
          prepend-icon-name="bi bi-backspace-fill"
          @click="emit('close-modal')"
        >
          Назад
        </Button>
        <Typography class-name="fs-3 text-primary">Уведомления</Typography>
        <Button
          v-if="showAllTab && hasNewNotifications"
          variant="primary"
          class-name="notification-window-modal__all-check-btn mb-3"
          prepend-icon-name="bi bi-check-all fs-3"
          @click="markAllAsRead"
        >
          Прочитать все
        </Button>
        <Button
          v-if="showAllTab && !hasNewNotifications"
          variant="mute"
          class-name="notification-window-modal__all-check-btn mb-3"
          prepend-icon-name="bi bi-check-all fs-3"
          @click="markAllAsRead"
        >
          Прочитать все
        </Button>
        <Button
          variant="primary"
          v-if="!showAllTab && hasFavoriteNotifications"
          class="notification-window-modal__all-check-btn mb-3"
          prepend-icon-name="bi bi-check-all fs-3"
          @click="removeAllFromFavorites"
        >
          Открепить все
        </Button>
        <Button
          v-if="!showAllTab && !hasFavoriteNotifications"
          variant="mute"
          class-name="notification-window-modal__all-check-btn mb-3"
          prepend-icon-name="bi bi-check-all fs-3"
          @click="removeAllFromFavorites"
        >
          Открепить все
        </Button>
      </div>

      <div class="notification-window-modal__pages-headers">
        <Button
          class-name="border-0"
          @click="switchTabToShow('all')"
          :class="[showAllTab ? 'active' : '']"
        >
          <Typography
            :class-name="
              !showAllTab
                ? 'fs-5 text-secondary'
                : 'fs-5 text-primary border-bottom border-primary border-3'
            "
          >
            Все
          </Typography>
        </Button>
        <Button
          class-name="border-0"
          @click="switchTabToShow('favorites')"
          :class="[!showAllTab ? 'active' : '']"
        >
          <Typography
            :class-name="
              showAllTab
                ? 'fs-5 text-secondary'
                : 'fs-5 text-primary border-bottom border-primary border-3'
            "
          >
            Избранное
          </Typography>
        </Button>
      </div>

      <div class="notification-window-modal__header">
        <div v-if="showAllTab">
          <div v-if="hasNewNotifications">
            <Typography class-name="fs-5 text-primary text-wrap"
              >Не прочитано</Typography
            >
            <div
              class="notification-window-modal__new-notification p-2 mb-2 rounded-3"
              v-for="notification in notifications"
              :key="notification.id"
            >
              <div
                v-if="notification.isReaded === false"
                class="notification-window-modal__new-notification bg-primary rounded-3 p-2"
                style="--bs-bg-opacity: 0.55"
              >
                <div class="notification-window-modal__title text-wrap row">
                  <div class-name="row">
                    <Typography class-name="fs-6 text-white col">{{
                      getFormattedDate(notification.createdAt)
                    }}</Typography>
                    <Button
                      class="notification-window-modal__favorite-btn text-white col float-end"
                      prepend-icon-name="bi bi-check fa-2x"
                      @click="markAsRead"
                    ></Button>
                    <Button
                      class="notification-window-modal__check-btn text-white col float-end btn-xs"
                      prepend-icon-name="bi bi-star"
                      @click="addToFavorites"
                    ></Button>
                  </div>
                  <Typography class-name="fs-6 text-white fw-bold col-2">
                    {{ notification.title }}
                  </Typography>
                </div>
                <Typography class-name="fs-6 text-white">{{
                  notification.message
                }}</Typography>
              </div>
            </div>

            <hr class="hr hr-blurry" />
          </div>
          <div v-if="notifications">
            <Typography class-name="fs-5 text-primary text-wrap"
              >Прочитано</Typography
            >

            <div
              v-for="notification in readedNotifications"
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
                      @click="addToFavorites"
                    ></Button>
                    <Button
                      class="notification-window-modal__favorite-btn text-primary col float-end"
                      v-else
                      prepend-icon-name="bi bi-star-fill"
                      @click="removeFromFavorites"
                    ></Button>
                  </div>
                  <Typography class-name="fs-6 text-black fw-bold col-2">
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

        <div v-else>
          <div v-if="hasFavoriteNotifications">
            <div
              class="notification-window-modal__notification mx-4"
              v-for="notification in favoriteNotifications"
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
                      @click="removeFromFavorites"
                    ></Button>
                  </div>
                  <Typography class-name="fs-6 text-black fw-bold col-2">
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
  &__title {
    display: flex;
    align-items: center;
  }
  &__top-btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
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
