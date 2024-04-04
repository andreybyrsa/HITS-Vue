<script lang="ts" setup>
import { computed, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { ApexOptions } from 'apexcharts'
import { useDateFormat } from '@vueuse/core'

import {
  BurndownModalProps,
  BurndownModalEmits,
} from '@Components/Modals/BurndownModal/BurndownModal.types'

import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { Task } from '@Domain/Project'

const props = defineProps<BurndownModalProps>()
const emit = defineEmits<BurndownModalEmits>()

const completedTasks = props.sprint.tasks.filter((task) =>
  task.status.includes('Done'),
)

function getFormattedDate(date: string) {
  const formattedDate = useDateFormat(new Date(date), 'DD.MM')
  return formattedDate.value
}

function getFormattedFullDate(date: string) {
  const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
  return formattedDate.value
}

function getDaysDifference(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const timeDifference = end.getTime() - start.getTime()

  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

  return daysDifference
}

function getArrayDays(startDate: string, endDate: string) {
  const daysDifference = getDaysDifference(startDate, endDate)
  const arrayDays = []

  for (let i = 0; i <= daysDifference; i++) {
    arrayDays.push(i)
  }

  return arrayDays
}

function getArrayCompleteTasksByDate(tasks: Task[], datesArray: string[]) {
  const sortTasks: number[] = []
  const lengthTasks = ref(props.sprint.tasks.length)
  const currentDate = getFormattedDate(new Date().toString())

  datesArray.forEach((date) => {
    let counter = 0
    tasks.forEach(
      ({ finishDate }) =>
        finishDate && getFormattedDate(finishDate) === date && counter++,
    )
    lengthTasks.value = lengthTasks.value - counter
    if (currentDate <= date) sortTasks.push(lengthTasks.value)
  })

  return sortTasks
}

const SimpleArrayOfDates = computed(() => {
  const datesArray: string[] = []

  getArrayDays(props.sprint.startDate, props.sprint.finishDate).forEach((i) => {
    const date = new Date(props.sprint.startDate)
    date.setDate(date.getDate() + i)
    datesArray.push(getFormattedDate(date.toJSON().toString()))
  })

  return datesArray
})

const PlanLine = computed(() => {
  const lengthArrayOfDates = SimpleArrayOfDates.value.length
  const totalTasks = props.sprint.tasks.length
  let planLine = []
  let step = totalTasks / (lengthArrayOfDates - 1)

  for (let i = totalTasks; i >= 0; i -= step) {
    planLine.push(i)
    if (i - step < 0) {
      planLine.push(0)
    }
  }

  return planLine
})

const comlitedTasksByDate = computed(() => {
  const datesArray = SimpleArrayOfDates.value
  const tasks = props.sprint.tasks
  let sortTasks: number[] = []

  datesArray.forEach((date) => {
    let counter = 0
    tasks.forEach(
      ({ finishDate }) =>
        finishDate && getFormattedDate(finishDate) === date && counter++,
    )
    sortTasks.push(counter)
  })

  return sortTasks
})

const factLineColor = () => {
  const completedTasksArray = getArrayCompleteTasksByDate(
    completedTasks,
    SimpleArrayOfDates.value,
  )
  const abovePlanCount = completedTasksArray.filter(
    (value, index) => value > PlanLine.value[index],
  ).length

  return abovePlanCount > completedTasksArray.length / 2 ? '#DC3545' : '#13A63A'
}

const data: ApexOptions = {
  chart: {
    type: 'line',
    zoom: {
      enabled: false,
    },
  },
  xaxis: {
    categories: SimpleArrayOfDates.value,
  },
  grid: {
    show: true,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  yaxis: {
    show: false,
  },
  series: [
    {
      name: 'Количество выполненных',
      type: 'column',
      data: comlitedTasksByDate.value,
      color: '#ffa800',
      zIndex: 0,
    },
    {
      name: 'План',
      type: 'line',
      data: PlanLine.value,
      color: '#0D6DFD',
      zIndex: 1,
    },
    {
      name: 'Количество невыполненных',
      type: 'line',
      data: getArrayCompleteTasksByDate(completedTasks, SimpleArrayOfDates.value),
      color: factLineColor(),
      zIndex: 2,
    },
  ],
  markers: {
    size: [7, 4],
    radius: 14,
  },
  tooltip: {
    enabled: true,
    intersect: true,
    shared: false,

    custom: function ({ series, seriesIndex, dataPointIndex }) {
      return (
        '<div class="arrow_box">' +
        '<span>' +
        Math.round(series[seriesIndex][dataPointIndex]) +
        '</span>' +
        '</div>'
      )
    },
  },
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="burndown-modal rounded bg-white px-3 py-2">
      <div class="burndown-modal__header w-100">
        <div
          class="burndown-modal__header-name fs-4 border-bottom text-primary w-100"
        >
          Спринт: "{{ sprint.name }}"
        </div>
        <Button
          @click="emit('close-modal')"
          variant="close"
        />
      </div>

      <div>
        <Typography class-name="text-primary"> Общие часы работы: </Typography>
        {{ sprint.workingHours }}ч
      </div>

      <div
        v-if="sprint.goal"
        class="w-100"
      >
        <ul class="list-group rounded-3">
          <li class="list-group-item p-0 overflow-hidden">
            <Button
              variant="light"
              class-name="collapse-controller w-100"
              v-collapse:openOnMount="sprint.id"
            >
              Цель
            </Button>
            <Collapse :id="sprint.id">
              <div class="p-2">{{ sprint.goal }}</div>
            </Collapse>
          </li>
        </ul>
      </div>

      <div class="d-flex gap-2 w-100">
        <div class="w-50">
          <Typography class-name="text-primary">Начало спринта*</Typography>
          <div class="px-2 py-1 rounded border w-100">
            {{ getFormattedFullDate(sprint.startDate) }}
          </div>
        </div>

        <div class="w-50">
          <Typography class-name="text-primary">Конец спринта*</Typography>
          <div class="px-2 py-1 rounded border w-100">
            {{ getFormattedFullDate(sprint.finishDate) }}
          </div>
        </div>
      </div>

      <div class="w-100 text-primary">
        Диаграмма сгорания*
        <VueApexCharts
          class="w-100"
          type="line"
          :options="data"
          :series="data.series"
        />
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}

.burndown-modal {
  width: 600px;

  @include flexible(
    flex-start,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  &__header {
    @include flexible(center, space-between);

    &-name {
      @include textEllipsis(1);
    }
  }
}

.modal-layout-enter-from .burndown-modal,
.modal-layout-leave-to .burndown-modal {
  transform: scale(0.9);
}
</style>
