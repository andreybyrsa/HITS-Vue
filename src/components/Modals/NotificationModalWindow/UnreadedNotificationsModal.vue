<script lang="ts" setup>
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useUserStore from '@Store/user/userStore'
import { useDateFormat } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const notificationsStore = useNotificationsStore()
const { notifications } = storeToRefs(notificationsStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const allAnReadedNotifications = computed(() => {
  return notifications.value.filter(
    (notification) => notification.isReaded === false,
  )
})

const markAllAsRead = async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    await notificationsStore.readAllNotifications(token)
  }
}

const markAsRead = async (id: string) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    await notificationsStore.readNotification(id, token)
  }
}

const addToFavorites = async (id: string) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    await notificationsStore.markAsFavoriteNotification(id, token)
  }
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'HH:MM DD.MM.YYYY')
    return formattedDate.value
  }
}
</script>

<template>
  <div class="notification-window-modal__header-unread w-100">
    <Typography class-name="fs-5 text-primary text-wrap">Не прочитано</Typography>

    <Button
      variant="primary"
      class-name="notification-window-modal__all-check-btn bg-white text-primary border-white text-center text-opacity-50   mb-3 me-2 p-0"
      @click="markAllAsRead"
    >
      Прочитать все ({{ notifications.length }})
      <Icon class-name="bi bi-check-all fs-3"></Icon>
    </Button>
  </div>
  <div
    class="notification-window-modal__new-notification p-2 mb-2 rounded-3"
    v-for="(notification, index) in allAnReadedNotifications"
    :key="index"
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
            @click="markAsRead(notification.id)"
          />
          <Button
            class="notification-window-modal__check-btn text-white col float-end btn-xs"
            prepend-icon-name="bi bi-star"
            @click="addToFavorites(notification.id)"
          />
        </div>
        <Typography class-name="fs-6 text-white w-50 fw-bold col-2">
          {{ notification.title }}
        </Typography>
      </div>
      <Typography class-name="fs-6 text-white">{{
        notification.message
      }}</Typography>
    </div>
  </div>
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
    width: 59%;
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
</style>
