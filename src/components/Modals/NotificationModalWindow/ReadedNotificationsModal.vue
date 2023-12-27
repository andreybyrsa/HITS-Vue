<script lang="ts" setup>
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useUserStore from '@Store/user/userStore'

import NotificationTab from '@Components/Modals/NotificationModalWindow/NotificationTab.vue'

import { useDateFormat } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import Notification from '@Domain/Notification'

const notificationsStore = useNotificationsStore()
const { notifications } = storeToRefs(notificationsStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const readedNotifications = computed(() => {
  return notifications.value.filter((notification) => notification.isReaded === true)
})

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

async function removeFromFavorites(notification: Notification) {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    await notificationsStore.unMarkAsFavoriteNotification(notification.id, token)
  }
}
</script>

<template>
  <div class="notification-window-modal__header-unread w-100">
    <Typography class-name="fs-5 text-primary text-wrap"
      >Прочитано ({{ readedNotifications.length }})
    </Typography>
  </div>

  <NotificationTab
    v-for="notification in readedNotifications"
    :key="notification.id"
    :notification="notification"
    is-favourite
    @icon-click="removeFromFavorites"
  />
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
    @include flexible(center, space-between);
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
