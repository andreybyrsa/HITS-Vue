<script lang="ts" setup>
import { ref } from 'vue'

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

function handleCloseModal() {
  emit('close-modal')
}

const newNotifications = ref<Notification[]>([
  {
    id: '0',
    title: 'Новое сообщение в чате 1',
    message: 'Менеджер: дедлайн завтра',
    readed: false,
  },
  {
    id: '1',
    title: 'Новое сообщение в чате 2',
    message: 'Менеджер: завтра',
    readed: false,
  },
])

const Notifications = ref<Notification[]>([
  {
    id: '0',
    title: 'Сообщение в чате 1',
    message: 'Менеджер: дедлайн завтра',
    readed: false,
  },
  {
    id: '1',
    title: 'Сообщение в чате 1',
    message: 'Менеджер: дедлайн завтра',
    readed: false,
  },
])
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="notification-window-modal p-3 bg-white rounded-3">
      <div class="notification-window-modal__header">
        <Typography class-name="fs-3 text-primary">2 новых уведомления</Typography>
        <div
          class="notification-window-modal__notification p-3 bg-white rounded-3"
          v-for="notification in newNotifications"
          :key="notification.id"
          :notification="notification"
        >
          <div class="notification-window-modal__title p-3 bg-primary rounded-3 row">
            <Typography class-name="fs-6 text-white col ">{{
              notification.title
            }}</Typography>
            <Button
              class-name="notification-window-modal__delete-button btn-white bg-primary text-white col-1"
              prepend-icon-name="bi bi-x-square"
            ></Button>
          </div>
          <Typography class-name="fs-6 text-black p-3">{{
            notification.message
          }}</Typography>
        </div>
        <hr class="hr hr-blurry" />
        <div class="notification-window-modal bg-white rounded-3 w-100">
          <div class="notification-window-modal__header">
            <Typography class-name="fs-3 text-primary">Прочитано</Typography>
            <div
              class="notification-window-modal__notification p-3 bg-white rounded-3"
              v-for="notification in Notifications"
              :key="notification.id"
              :notification="notification"
            >
              <div
                class="notification-window-modal__title p-3 bg-primary rounded-3 row"
              >
                <Typography class-name="fs-6 text-white col">{{
                  notification.title
                }}</Typography>
                <Button
                  class-name="notification-window-modal__delete-button btn-white bg-primary text-white col-1"
                  prepend-icon-name="bi bi-x-square"
                ></Button>
              </div>
              <Typography class-name="fs-6 text-black p-3">{{
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
  width: 80%;
  &__delete-button {
    @include flexible(flex-start, flex-end);
    width: 5%;
  }
  &__title {
    display: flex;
    align-items: center;
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
