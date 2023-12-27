<script lang="ts" setup>
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useUserStore from '@Store/user/userStore'

import Button from '@Components/Button/Button.vue'

import { useDateFormat } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const notificationsStore = useNotificationsStore()
const { notifications } = storeToRefs(notificationsStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const readedNotifications = computed(() => {
  return notifications.value.filter((notification) => notification.isReaded === true)
})

const removeFromFavorites = async (id: string) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    await notificationsStore.unMarkAsFavoriteNotification(id, token)
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
    <Typography class-name="fs-5 text-primary text-wrap"
      >Прочитано ({{ readedNotifications.length }})
    </Typography>
  </div>

  <div
    v-for="(notification, index) in readedNotifications"
    :key="index"
    class="notification-window-modal__notification p-2"
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
            @click="addToFavorites(notification.id)"
          />
          <Button
            class="notification-window-modal__favorite-btn text-primary col float-end"
            v-else
            prepend-icon-name="bi bi-star-fill"
            @click="removeFromFavorites(notification.id)"
          />
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
