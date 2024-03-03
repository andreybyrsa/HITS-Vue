<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="task-history-modal p-3 rounded-3">
      <div class="task-history-modal__header w-100">
        <Typography class-name="fs-4 text-primary"> Подробности этапа </Typography>

        <Button
          variant="close"
          @click="emit('close-modal')"
        ></Button>
      </div>

      <div class="task-history-modal__content content">
        <div class="content__date">
          <Typography class-name="fs-6 text-secondary">{{
            getFormattedDate(props.log.startDate)
          }}</Typography>

          <Icon
            v-if="props.log.endDate"
            class-name="bi fs-4 bi-arrow-right"
          />

          <Typography class-name="fs-6 text-secondary">{{
            getFormattedDate(props.log.endDate)
          }}</Typography>
        </div>

        <div v-if="props.log?.executor">
          <Typography class-name="text-black">Исполнитель этапа:</Typography>
          <div class="user">
            <div
              class="link"
              @click="navigateToProfileModal(props.log.executor?.id)"
            >
              <Typography class-name="text-primary d-block mb-1 my-1"
                >{{ props.log.executor?.firstName }}
                {{ props.log.executor?.lastName }}</Typography
              >
            </div>

            <div>role</div>
          </div>
        </div>

        <div>
          <Typography class-name="text-black">Назначил этап:</Typography>
          <div class="user">
            <div
              class="link text-primary"
              @click="navigateToProfileModal(props.log.user?.id)"
            >
              <Typography class-name=" text-primary d-block mb-1 my-1"
                >{{ props.log.user?.firstName }}
                {{ props.log.user?.lastName }}</Typography
              >
            </div>

            <div>role</div>
          </div>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue'

import {
  TaskHistoryModalProps,
  TaskHistoryModalEmits,
} from '@Components/Modals/TaskHistoryModal/TaskHistoryModal.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Profile from '@Components/Modals/ProfileModal/ProfileModal.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import { useDateFormat } from '@vueuse/core'
import Icon from '@Components/Icon/Icon.vue'
import { RouteRecordRaw } from 'vue-router'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'

const props = defineProps<TaskHistoryModalProps>()
const emit = defineEmits<TaskHistoryModalEmits>()

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY HH:mm')
    return formattedDate.value
  }
}

function navigateToProfileModal(id: string) {
  const profileModalRoute: RouteRecordRaw = {
    name: 'profile',
    path: 'profile/:id',
    alias: '/profile/:id',
    component: Profile,
    props: {
      canGoBack: true,
    },
  }

  navigateToAliasRoute('projects-list', `/profile/${id}`, profileModalRoute)
}
</script>

<style scoped lang="scss">
.task-history-modal {
  width: 400px;
  background-color: $white-color;

  @include flexible(
    flex-start,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }
}

.content {
  width: 100%;
  @include flexible(start, start, column, $gap: 16px);

  &__date {
    width: 100%;
    @include flexible(center, center, $gap: 16px);
  }
}

.user {
  @include flexible(center, start, $gap: 16px);
}

.link {
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-thickness: 1px;
  }
}
</style>
