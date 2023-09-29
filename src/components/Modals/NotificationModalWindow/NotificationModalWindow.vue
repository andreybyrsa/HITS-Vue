<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import { vIntersectionObserver } from '@vueuse/components'

import {
  NotificatonModalWindowEmits,
  NotificatonModalWindowProps,
} from '@Components/Modals/NotificationModalWindow/NotificationModalWindow.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'

import Notification from '@Domain/Notification'
import Button from '@Components/Button/Button.vue'

const props = defineProps<NotificatonModalWindowProps>()

const emit = defineEmits<NotificatonModalWindowEmits>()

// const Notifications = ref<Notification[]>([
//   {
//     id: '0',
//     title: 'Чат 1',
//     message: 'Попов(менеджер, проект 1): дедлайн завтра',
//     readed: false,
//     time: '20:15',
//     data: '28.09.23',
//   },
//   {
//     id: '1',
//     title: 'Чат 2',
//     message: 'Петров(менеджер, проект 2): завтра',
//     readed: false,
//     time: '12:34',
//     data: '28.09.23',
//   },
//   {
//     id: '2',
//     title: 'Чат 1',
//     message: 'Попов(менеджер, проект 1): дедлайн завтра',
//     readed: true,
//     time: '14:40',
//     data: '27.09.23',
//   },
//   {
//     id: '3',
//     title: 'Чат 2',
//     message: 'Петров(менеджер, проект 2): дедлайн завтра',
//     readed: true,
//     time: '12:34',
//     data: '26.09.23',
//   },
// ])

// const newNotifications = ref<Notification[]>([])
// const readedNotifications = ref<Notification[]>([])

// for (const notification of Notifications.value) {
//   if (notification.readed === false) {
//     newNotifications.value.push(notification)
//   } else {
//     readedNotifications.value.push(notification)
//   }
// }

// // const markAllAsRead = () => {
// //   newNotifications.value.forEach((notification: Notification) => {
// //     notification.readed = true
// //   })
// // }

// // const markAsRead = (notification: Notification) => {
// //   notification.readed = true
// // }

// const markAllAsRead = () => {
//   newNotifications.value.forEach((notification) => {
//     notification.readed = true
//     readedNotifications.value.push(notification)
//   })

//   newNotifications.value = []
// }

// const markAsRead = (notification: Notification) => {
//   notification.readed = true
//   newNotifications.value = newNotifications.value.filter(
//     (n) => n.id !== notification.id,
//   )
//   readedNotifications.value.push(notification)
// }

const Notifications = ref<Notification[]>([
  {
    id: '0',
    title: 'Чат 1',
    message: 'Попов(менеджер, проект 1): дедлайн завтра',
    readed: false,
    time: '20:15',
    data: '28.09.23',
  },
  {
    id: '1',
    title: 'Чат 2',
    message: 'Петров(менеджер, проект 2): завтра',
    readed: false,
    time: '12:34',
    data: '28.09.23',
  },
  {
    id: '2',
    title: 'Чат 1',
    message: 'Попов(менеджер, проект 1): дедлайн завтра',
    readed: true,
    time: '14:40',
    data: '27.09.23',
  },
  {
    id: '3',
    title: 'Чат 2',
    message: 'Петров(менеджер, проект 2): дедлайн завтра',
    readed: true,
    time: '12:34',
    data: '26.09.23',
  },
])

const newNotifications = ref<Notification[]>([])
const readedNotifications = ref<Notification[]>([])

for (const notification of Notifications.value) {
  if (notification.readed === false) {
    newNotifications.value.push(notification)
  } else {
    readedNotifications.value.push(notification)
  }
}

// const markAllAsRead = () => {
//   newNotifications.value.forEach((notification) => {
//     notification.readed = true
//   })
// }

// const markAsRead = (notification: Notification) => {
//   notification.readed = true
// }

const markAllAsRead = () => {
  newNotifications.value.forEach((notification) => {
    notification.readed = true
    readedNotifications.value.push(notification)
  })

  newNotifications.value = []
}

const markAsRead = (notification: Notification) => {
  notification.readed = true
  newNotifications.value = newNotifications.value.filter(
    (n) => n.id !== notification.id,
  )
  readedNotifications.value.push(notification)
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
          class="notification-window-modal__all-check-btn btn-primary mb-3"
          prepend-icon-name="bi bi-check-all fs-3"
          @click="markAllAsRead()"
        >
          Прочитать все
        </Button>
      </div>
      <div class="notification-window-modal__header">
        <div v-if="newNotifications.length > 0">
          <Typography class-name="fs-5 text-primary text-wrap"
            >Не прочитано</Typography
          >
          <div
            class="notification-window-modal__new-notification p-2 mb-2 bg-primary rounded-3"
            style="--bs-bg-opacity: 0.55"
            v-for="notification in newNotifications"
            :key="notification.id"
            :notification="notification"
          >
            <div class="notification-window-modal__title text-wrap row">
              <div class-name="row">
                <Typography class-name="fs-6 text-white col">{{
                  notification.time
                }}</Typography>
                <Typography class-name="fs-6 text-white px-3 col-1 ">{{
                  notification.data
                }}</Typography>
                <Button
                  class="notification-window-modal__check-btn text-white col-1 float-end"
                  prepend-icon-name="bi bi-check fa-2x"
                  @click="markAsRead(notification)"
                ></Button>
              </div>
              <Typography class-name="fs-6 text-white fw-bold col-2 ">{{
                notification.title
              }}</Typography>
            </div>
            <Typography class-name="fs-6 text-white">{{
              notification.message
            }}</Typography>
          </div>
          <hr class="hr hr-blurry" />
        </div>
        <div class="notification-window-modal bg-white rounded-3 w-100">
          <div class="notification-window-modal__header">
            <Typography class-name="fs-5 text-primary text-wrap"
              >Прочитано</Typography
            >
            <div
              class="notification-window-modal__notification p-2 mb-2 bg-white border border-primary rounded-3"
              v-for="notification in readedNotifications"
              :key="notification.id"
              :notification="notification"
            >
              <div class="notification-window-modal__title text-wrap row">
                <div class-name="row">
                  <Typography class-name="fs-6 text-black col">{{
                    notification.time
                  }}</Typography>
                  <Typography class-name="fs-6 text-black px-3 col-1 ">{{
                    notification.data
                  }}</Typography>
                </div>
                <Typography class-name="fs-6 text-black fw-bold col-2 ">{{
                  notification.title
                }}</Typography>
              </div>
              <Typography class-name="fs-6 text-black">{{
                notification.message
              }}</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
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
