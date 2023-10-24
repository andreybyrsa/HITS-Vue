<script lang="ts" setup>
import { ref, computed } from 'vue'

import {
  NotificatonModalWindowEmits,
  NotificatonModalWindowProps,
} from '@Components/Modals/NotificationModalWindow/NotificationModalWindow.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'

import Notification from '@Domain/Notification'
import Button from '@Components/Button/Button.vue'

defineProps<NotificatonModalWindowProps>()

const emit = defineEmits<NotificatonModalWindowEmits>()

const Notifications = ref<Notification[]>([
  {
    id: 0,
    title: 'Чат 1',
    message: 'Попов(менеджер, проект 1): дедлайн завтра',
    readed: false,
    isFavorite: false,
    time: '20:15',
    data: '28.09.23',
    type: 'USER',
  },
  {
    id: 1,
    title: 'Чат 2',
    message: 'Петров(менеджер, проект 2): завтра',
    readed: false,
    isFavorite: false,
    time: '12:34',
    data: '28.09.23',
    type: 'USER',
  },
  {
    id: 2,
    title: 'Чат 1',
    message: 'Попов(менеджер, проект 1): дедлайн завтра',
    readed: true,
    isFavorite: false,
    time: '14:40',
    data: '27.09.23',
    type: 'USER',
  },
  {
    id: 3,
    title: 'Чат 2',
    message: 'Петров(менеджер, проект 2): дедлайн завтра',
    readed: true,
    isFavorite: false,
    time: '12:34',
    data: '26.09.23',
    type: 'USER',
  },
])

const newNotifications = ref<Notification[]>([])
const readedNotifications = ref<Notification[]>([])

const favoriteNotifications = ref<Notification[]>([])

for (const notification of Notifications.value) {
  if (notification.readed === false) {
    newNotifications.value.push(notification)
  } else {
    readedNotifications.value.push(notification)
  }
}

const showAllTab = ref(true)

const hasNewNotifications = computed(() => newNotifications.value.length > 0)

const hasFavoriteNotifications = computed(
  () => favoriteNotifications.value.length > 0,
)
const switchTabToShow = (tab: any) => {
  showAllTab.value = tab === 'all'
}

const markAllAsRead = () => {
  newNotifications.value.forEach((notification) => {
    notification.readed = true
    readedNotifications.value.unshift(notification)
  })
  newNotifications.value = []
}

const markAsRead = (notification: Notification) => {
  notification.readed = true
  newNotifications.value = newNotifications.value.filter(
    (n) => n.id !== notification.id,
  )
  readedNotifications.value.unshift(notification)
}

const addToFavorites = (notification: Notification) => {
  notification.isFavorite = true
  if (!notification.readed) {
    notification.readed = true
    readedNotifications.value.unshift(notification)
  }
  const index = newNotifications.value.findIndex((n) => n.id === notification.id)
  if (index !== -1) {
    newNotifications.value.splice(index, 1)
  }
  favoriteNotifications.value.push(notification)
}

const removeFromFavorites = (notification: Notification) => {
  notification.isFavorite = false
  favoriteNotifications.value = favoriteNotifications.value.filter(
    (n) => n.id !== notification.id,
  )
}

const removeAllFromFavorites = () => {
  favoriteNotifications.value.forEach((notification) => {
    notification.isFavorite = false
  })
  favoriteNotifications.value = []
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
    class-name="px-3 pb-3"
  >
    <div class="notification-window-modal p-3 bg-white rounded-3">
      <div class="notification-window-modal__top-btn">
        <Button
          class-name="btn-primary mb-3"
          prepend-icon-name="bi bi-backspace-fill"
          @click="emit('close-modal')"
        >
          Назад
        </Button>
        <Typography class-name="fs-3 text-primary">Уведомления</Typography>
        <Button
          v-if="showAllTab && hasNewNotifications"
          class="notification-window-modal__all-check-btn btn-primary mb-3"
          prepend-icon-name="bi bi-check-all fs-3"
          @click="markAllAsRead"
        >
          Прочитать все
        </Button>
        <Button
          v-if="showAllTab && !hasNewNotifications"
          class="notification-window-modal__all-check-btn btn-mute mb-3"
          prepend-icon-name="bi bi-check-all fs-3"
          @click="markAllAsRead"
        >
          Прочитать все
        </Button>
        <Button
          v-if="!showAllTab && hasFavoriteNotifications"
          class="notification-window-modal__all-check-btn btn-primary mb-3"
          prepend-icon-name="bi bi-check-all fs-3"
          @click="removeAllFromFavorites"
        >
          Открепить все
        </Button>
        <Button
          v-if="!showAllTab && !hasFavoriteNotifications"
          class="notification-window-modal__all-check-btn btn-mute mb-3"
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
            class-name="fs-5 "
            :class="{
              'text-primary border-bottom border-primary border-3': showAllTab,
              'text-secondary': !showAllTab,
            }"
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
            class-name="fs-5 "
            :class="{
              'text-primary border-bottom border-primary border-3': !showAllTab,
              'text-secondary': showAllTab,
            }"
          >
            Избранное
          </Typography>
        </Button>
      </div>

      <div class="notification-window-modal__header">
        <div v-if="showAllTab">
          <div v-if="hasNewNotifications">
            <div>
              <Typography class-name="fs-5 text-primary text-wrap"
                >Не прочитано</Typography
              >
              <div
                class="notification-window-modal__new-notification p-2 mb-2 bg-primary rounded-3"
                style="--bs-bg-opacity: 0.55"
                v-for="notification in newNotifications"
                :key="notification.id"
              >
                <div class="notification-window-modal__title text-wrap row">
                  <div class-name="row">
                    <Typography class-name="fs-6 text-white col">{{
                      notification.time
                    }}</Typography>
                    <Typography class-name="fs-6 text-white px-3 col-1 ">
                      {{ notification.data }}
                    </Typography>
                    <Button
                      class="notification-window-modal__favorite-btn text-white col float-end"
                      prepend-icon-name="bi bi-check fa-2x"
                      @click="markAsRead(notification)"
                    ></Button>
                    <Button
                      class="notification-window-modal__check-btn text-white col float-end btn-xs"
                      prepend-icon-name="bi bi-star"
                      @click="addToFavorites(notification)"
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
              <hr class="hr hr-blurry" />
            </div>
          </div>
          <Typography class-name="fs-5 text-primary text-wrap">Прочитано</Typography>
          <div
            v-for="notification in readedNotifications"
            :key="notification.id"
            class="notification-window-modal__notification p-2 mb-2 bg-white border border-primary rounded-3"
          >
            <div class="notification-window-modal__title text-wrap row">
              <div class-name="row">
                <Typography class-name="fs-6 text-black col">
                  {{ notification.time }}
                </Typography>
                <Typography class-name="fs-6 text-black px-3 col-1">
                  {{ notification.data }}
                </Typography>
                <Button
                  class="notification-window-modal__favorite-btn text-primary col float-end"
                  v-if="!notification.isFavorite"
                  prepend-icon-name="bi bi-star"
                  @click="addToFavorites(notification)"
                ></Button>
                <Button
                  class="notification-window-modal__favorite-btn text-primary col float-end"
                  v-else
                  prepend-icon-name="bi bi-star-fill"
                  @click="removeFromFavorites(notification)"
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
        </div>
        <div v-else>
          <div v-if="hasFavoriteNotifications">
            <div
              class="notification-window-modal__notification p-2 mb-2 bg-white border border-primary rounded-3"
              v-for="notification in favoriteNotifications"
              :key="notification.id"
            >
              <div class="notification-window-modal__title text-wrap row">
                <div class-name="row">
                  <Typography class-name="fs-6 text-black col">{{
                    notification.time
                  }}</Typography>
                  <Typography class-name="fs-6 text-black px-3 col-1 ">
                    {{ notification.data }}
                  </Typography>
                  <Button
                    class="notification-window-modal__check-btn text-white col-1 float-end"
                    prepend-icon-name="bi bi-star-fill text-primary"
                    @click="removeFromFavorites(notification)"
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
