<script lang="ts" setup>
import { RouteRecordRaw } from 'vue-router'

import { TaskDataProps } from '@Components/Modals/ActiveSprintTaskModal/ActiveSprintTaskModal.types'

import Icon from '@Components/Icon/Icon.vue'
import Profile from '@Components/Modals/ProfileModal/ProfileModal.vue'

import { getTaskStatus } from '@Utils/getTaskStatus'

import navigateToAliasRoute from '@Utils/navigateToAliasRoute'

const props = defineProps<TaskDataProps>()

function navigateToProfileModal(id?: string) {
  const profileModalRoute: RouteRecordRaw = {
    name: 'profile',
    path: 'profile/:id',
    alias: '/profile/:id',
    component: Profile,
    props: {
      canGoBack: true,
    },
  }

  navigateToAliasRoute('project', `/profile/${id}`, profileModalRoute)
}
</script>

<template>
  <div>
    <div
      class="text-center p-2 bg-primary rounded-top text-white fs-4 border border-bottom-0"
    >
      {{ getTaskStatus().translatedStatus[props.task.status] }}
    </div>

    <div
      class="d-flex flex-column gap-2 bg-white rounded-bottom p-3 border border-top-0"
    >
      <div class="px-2">
        <div class="text-secondary border-bottom pb-1 mb-2">Постановщик</div>
        <div class="task-info gap-1">
          <Icon
            class-name="text-secondary fs-3 opacity-25"
            class="bi bi-person-circle"
          />
          <div
            class="task-info__link text-primary"
            @click="navigateToProfileModal(task.initiator.id)"
          >
            {{ task.initiator.firstName }} {{ task.initiator.lastName }}
          </div>
        </div>
      </div>

      <div class="px-2">
        <div class="text-secondary border-bottom pb-1 mb-2">Исполнитель</div>
        <div class="task-info gap-1">
          <Icon
            class-name="text-secondary fs-3 opacity-25"
            class="bi bi-person-circle"
          />
          <div
            v-if="task.executor?.id"
            class="task-info__link text-primary"
            @click="navigateToProfileModal(task.executor?.id)"
          >
            {{ props.task.executor?.firstName }} {{ props.task.executor?.lastName }}
          </div>
          <div
            v-else
            class="text-primary"
          >
            Не назначен
          </div>
        </div>
      </div>

      <div class="px-2">
        <div class="text-secondary border-bottom pb-1 mb-2">Трудоемкость</div>
        <div class="task-info gap-1">
          <Icon
            class-name="text-secondary fs-3 opacity-25"
            class="bi bi-clock"
          />
          <div class="text-primary">{{ task.workHour }}ч</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.task-info {
  @include flexible(center, start);

  &__link {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 1px;
    }
  }
}
</style>
