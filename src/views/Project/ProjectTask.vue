<template>
  <div class="w-100 border rounded-3 mb-3">
    <div class="w-100 d-flex align-items-stretch justify-content-between">
      <div class="d-flex gap-2">
        <div
          v-if="task.status === 'InBackLog'"
          class="d-flex align-items-center bg-primary px-3 rounded-start-3 position-relative"
          v-tooltip="'Приоритетность задачи'"
        >
          <div
            v-if="isOpenCollapse"
            class="particle bg-primary"
          ></div>
          <Typography class-name="text-white fs-5">{{ task.position }}</Typography>
        </div>
        <div
          v-if="task.status === 'Done'"
          class="d-flex align-items-center bg-secondary px-3 rounded-start-3 position-relative"
          v-tooltip="'Задача уже сделана'"
        >
          <div
            v-if="isOpenCollapse"
            class="particle bg-secondary"
          ></div>
        </div>
        <div
          v-if="
            task.status === 'NewTask' ||
            task.status === 'OnModification' ||
            task.status === 'OnVerification' ||
            task.status === 'inProgress'
          "
          class="d-flex align-items-center bg-warning px-3 rounded-start-3 position-relative"
          v-tooltip="'Задача в активном спринте'"
        >
          <div
            v-if="isOpenCollapse"
            class="particle bg-warning"
          ></div>
        </div>

        <div
          class="d-flex align-items-center"
          v-tooltip="task.name"
        >
          <Typography class-name="fs-5 fw-semibold text-truncate">{{
            task.name
          }}</Typography>
        </div>

        <div class="d-flex align-items-center gap-2">
          <div
            v-for="tag in task.tag"
            :key="tag.id"
            class="d-flex gap-1 p-1 rounded-2 text-center align-items-center"
            :style="{
              backgroundColor: `rgb(${hexToRgb(tag.color)}, 0.3)`,
              color: tag.color,
            }"
          >
            <Icon
              class-name="bi bi-circle-fill "
              :style="{ color: tag.color }"
              v-tooltip="tag.name"
            />
          </div>
        </div>
      </div>

      <Button
        v-collapse="task.id"
        class-name="d-flex gap-2 border-0 fw-semibold"
        @click="openCollapse"
      >
        <Typography>Описание</Typography>
        <Icon class-name="bi bi-chevron-down fs-5" />
      </Button>
    </div>

    <Collapse
      :id="task.id"
      class-name="w-100 "
    >
      <div class="w-100 d-flex border-top">
        <div class="w-75 p-2">
          <Typography class-name="text-secondary"
            >{{ task.description }}
          </Typography>
        </div>

        <div class="w-25 border-start p-2">
          <div>
            Постановщик: {{ task.initiator.lastName }} {{ task.initiator.firstName }}
          </div>

          <div>Дата создания: {{ getFormattedDate(task.startDate) }}</div>

          <div>Трудоемкость: {{ task.workHour }}ч</div>
        </div>
      </div>
    </Collapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Icon from '@Components/Icon/Icon.vue'
import Typography from '@Components/Typography/Typography.vue'

import { TaskProps } from '@Views/Project/Project.types'
import { useDateFormat } from '@vueuse/core'

defineProps<TaskProps>()

const isOpenCollapse = ref(false)

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return (
    result &&
    `${parseInt(result[1], 16)},
        ${parseInt(result[2], 16)},
        ${parseInt(result[3], 16)}`
  )
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function openCollapse() {
  if (isOpenCollapse.value === false) {
    isOpenCollapse.value = true
  } else {
    isOpenCollapse.value = false
  }
}
</script>

<style scoped lang="scss">
.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  bottom: 0;
  left: 0;
}
</style>
