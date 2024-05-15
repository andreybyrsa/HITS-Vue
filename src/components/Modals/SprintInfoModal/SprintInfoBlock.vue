<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'

import Icon from '@Components/Icon/Icon.vue'

import { Sprint } from '@Domain/Project'

defineProps<{ sprint: Sprint }>()

function getFormattedDate(date: string) {
  const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
  return formattedDate.value
}
</script>

<template>
  <div>
    <div
      class="text-center p-2 bg-primary rounded-top text-white fs-5 border border-bottom-0"
    >
      Информация
    </div>

    <div
      class="d-flex flex-column gap-2 bg-white rounded-bottom p-2 border border-top-0"
    >
      <div class="px-2">
        <div class="text-secondary border-bottom pb-1 mb-2">Начало спринта</div>
        <div class="sprint-info gap-1">
          <Icon
            class-name="text-secondary fs-3 opacity-25"
            class="bi bi-clock"
          />
          <div class="text-primary">
            {{ getFormattedDate(sprint.startDate) }}
          </div>
        </div>
      </div>

      <div class="px-2">
        <div class="text-secondary border-bottom pb-1 mb-2">Конец спринта</div>
        <div class="sprint-info gap-1">
          <Icon
            class-name="text-secondary fs-3 opacity-25"
            class="bi bi-clock"
          />
          <div class="text-primary">
            {{ getFormattedDate(sprint.finishDate) }}
          </div>
        </div>
      </div>

      <div class="px-2">
        <div class="text-secondary border-bottom pb-1 mb-2">Выполнено задач</div>
        <div class="sprint-info gap-1">
          <Icon
            class-name="text-secondary fs-3 opacity-25"
            class="bi bi-check2-circle"
          />
          <div class="text-primary">
            {{ sprint.tasks.filter(({ status }) => status === 'Done').length }}
          </div>
        </div>
      </div>

      <div class="px-2">
        <div class="text-secondary border-bottom pb-1 mb-2">Потрачено часов</div>
        <div class="sprint-info gap-1">
          <Icon
            class-name="text-secondary fs-3 opacity-25"
            class="bi bi-clock"
          />
          <div class="text-primary">{{ sprint.workingHours }}ч</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sprint-info {
  @include flexible(center, start);
}
</style>
