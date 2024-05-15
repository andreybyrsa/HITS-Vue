<script lang="ts" setup>
import Icon from '@Components/Icon/Icon.vue'

import { Task } from '@Domain/Project'

defineProps<{ task?: Task }>()

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return (
    result &&
    `${parseInt(result[1], 16)},
        ${parseInt(result[2], 16)},
        ${parseInt(result[3], 16)}`
  )
}
</script>

<template>
  <div v-if="task">
    <div
      class="text-center p-2 bg-primary rounded-top text-white fs-5 border border-bottom-0"
    >
      Информация
    </div>

    <div
      class="d-flex flex-column gap-2 bg-white rounded-bottom p-2 border border-top-0"
    >
      <div class="px-2">
        <div class="text-secondary border-bottom pb-1 mb-2">Постановщик</div>
        <div class="task-info gap-1">
          <Icon
            class-name="text-secondary fs-3 opacity-25"
            class="bi bi-person-circle"
          />
          <div class="task-info__link text-primary">
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
          >
            {{ task.executor?.firstName }} {{ task.executor?.lastName }}
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

      <div class="px-2">
        <div class="text-secondary border-bottom pb-1 mb-2">Теги</div>
        <div class="d-flex flex-wrap gap-2 w-100 mt-2">
          <div
            v-for="(tag, index) in task.tags"
            :key="index"
            :style="{
              backgroundColor: `rgb(${hexToRgb(tag.color)}, 0.3)`,
              color: tag.color,
            }"
            class="px-2 py-1 rounded-2 text-center align-self-start"
          >
            {{ tag.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.task-info {
  @include flexible(center, start);
}
</style>
