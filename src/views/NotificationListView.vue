<script lang="ts" setup>
import { ref } from 'vue'

import PageLayout from '@Layouts/PageLayout/PageLayout.vue'
import LeftSideBar from '@Components/LeftSideBar/LeftSideBar.vue'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import NotificationElement from '@Components/NotificationElement/NotificationElement.vue'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'

import FilterModal from '@Components/Modals/FilterModalNotification/FilterModalNotification.vue'

const isOpenedFilter = ref(false)
const selectedFilters = ref<string[]>([])

function handleCloseModal(filters?: string[]) {
  if (filters) {
    selectedFilters.value = filters
  }
  isOpenedFilter.value = false
}

function formatDate(date: Date) {
  if (date) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(date).toLocaleDateString('ru-RU', options)
  }
}
</script>

<template>
  <PageLayout content-class-name="login-page__content">
    <template #leftSideBar>
      <LeftSideBar />
    </template>
    <template #content>
      <FormLayout class-name="notification-form">
        <div class="notification-form__header">
          <Typography class-name=" fs-1 text-primary"
            >Журнал уведомлений</Typography
          >
          <Button
            class-name="btn-primary"
            prepend-icon-name="bi bi-funnel-fill"
            @click="isOpenedFilter = true"
            >Сортировка</Button
          >
          <FilterModal
            :is-opened="isOpenedFilter"
            @close-modal="handleCloseModal"
            :current-filters="[...selectedFilters]"
          />
        </div>

        <div class="notification-form__notification-container">
          <NotificationElement
            :date="formatDate(new Date(2001, 11, 15))"
            text="green"
            type="system"
            >Вы зарегистрировались</NotificationElement
          >
          <NotificationElement
            :date="formatDate(new Date(2001, 11, 15))"
            text="red"
            type="personal"
            >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit,
            accusamus atque. Explicabo laboriosam voluptatibus veniam natus,
            accusantium fuga eum quaerat nisi. Quisquam cum quidem perferendis,
            ipsam quaerat ad nobis omnis!</NotificationElement
          >
          <NotificationElement
            :date="formatDate(new Date(2001, 11, 15))"
            type="ideas"
            >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit,
            accusamus atque. Explicabo laboriosam voluptatibus veniam natus,
            accusantium fuga eum quaerat nisi. Quisquam cum quidem perferendis,
            ipsam quaerat ad nobis omnis!</NotificationElement
          >
          <NotificationElement
            :date="formatDate(new Date(2001, 11, 15))"
            type="system"
            >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit,
            accusamus atque. Explicabo laboriosam voluptatibus veniam natus,
            accusantium fuga eum quaerat nisi. Quisquam cum quidem perferendis,
            ipsam quaerat ad nobis omnis!</NotificationElement
          >
          <NotificationElement
            :date="formatDate(new Date(2001, 11, 15))"
            type="system"
            >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit,
            accusamus atque. Explicabo laboriosam voluptatibus veniam natus,
            accusantium fuga eum quaerat nisi. Quisquam cum quidem perferendis,
            ipsam quaerat ad nobis omnis!</NotificationElement
          >
          <NotificationElement
            :date="formatDate(new Date(2001, 11, 15))"
            type="system"
            >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit,
            accusamus atque. Explicabo laboriosam voluptatibus veniam natus,
            accusantium fuga eum quaerat nisi. Quisquam cum quidem perferendis,
            ipsam quaerat ad nobis omnis!</NotificationElement
          >
        </div>
      </FormLayout>
    </template>
  </PageLayout>
</template>

<style lang="scss" scoped>
.login-page {
  &__content {
    @include flexible(center, center);
  }
}

.notification-form {
  width: 95%;
  height: 95%;

  &__content {
    @include flexible(stretch, space-between, $gap: 16px);
  }
  &__header {
    width: 100%;
    @include flexible(flex-start, space-between);
  }
  &__notification-container {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-right: 34px;
    @include gridable();
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
