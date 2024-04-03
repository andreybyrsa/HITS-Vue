<script lang="ts" setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { ApexOptions } from 'apexcharts'
import { Task } from '@Domain/Project'
import { useDateFormat } from '@vueuse/core'
import { SprintChartProps } from '@Components/Modals/BurndownModal/BurndownModal.types'

const props = defineProps<SprintChartProps>()

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM')
    return formattedDate.value
  } else {
    return 'Реализуется'
  }
}

function getFormattedDateWithY(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  } else {
    return 'Реализуется'
  }
}

function getDaysDifference(startDate: string, endDate: string) {
  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const timeDifference = end.getTime() - start.getTime()

    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

    return daysDifference
  } else {
    return 'Реализуется'
  }
}

function getArrayOfDates(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const limiter = getDaysDifference(startDate, endDate)

  const datesArray = []
  if (typeof limiter === 'number') {
    for (let i = 0; i <= limiter; i++) {
      const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)
      datesArray.push(getFormattedDate(currentDate.toISOString()))
    }

    return datesArray
  }
}

function getArrayCompleteTasksByDate(tasks: Task[], datesArray: string[]) {
  let sortTasks = []
  let output = []
  for (let i = 0; i < datesArray.length; i++) {
    let counter = 0
    for (let j = 0; j < tasks.length; j++) {
      if (tasks[j].finishDate === datesArray[i]) {
        counter++
      }
    }
    sortTasks.push(counter)
  }

  let couter = props.sprint.tasks.length
  for (let i = 0; i < sortTasks.length; i++) {
    output[i] = couter - sortTasks[i]
    couter -= sortTasks[i]
  }
  return output
}

const ArrayOfDates = computed(() => {
  return getArrayOfDates(props.sprint.startDate, props.sprint.finishDate)
})

const SimpleArrayOfDates = computed(() => {
  const start = new Date(props.sprint.startDate)
  const limiter = getDaysDifference(props.sprint.startDate, props.sprint.finishDate)

  const datesArray = []
  if (typeof limiter === 'number') {
    for (let i = 0; i <= limiter; i++) {
      const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)
      datesArray.push(getFormattedDateWithY(currentDate.toISOString()))
    }
  }
  return datesArray
})

const PlanLine = computed(() => {
  const lengthArrayOfDates = ArrayOfDates.value?.length
  let step = 0
  let planLine = []
  const totalTasks = props.sprint.tasks.length
  if (typeof lengthArrayOfDates === 'number' && lengthArrayOfDates > 0) {
    step = totalTasks / (lengthArrayOfDates - 1)
  }
  for (let i = totalTasks; i >= 0; i -= step) {
    planLine.push(i)
    if (i - step < 0) {
      planLine.push(0)
    }
  }
  return planLine
})

const tasksProp = computed(() => {
  return props.sprint.tasks
})

const completedTasks = tasksProp.value.filter((task) => task.status.includes('Done'))

const comlitedTasksByDate = computed(() => {
  const datesArray = SimpleArrayOfDates.value
  const tasks = props.sprint.tasks
  let sortTasks = []

  for (let i = 0; i < datesArray.length; i++) {
    let counter = 0
    for (let j = 0; j < tasks.length; j++) {
      if (tasks[j].finishDate === datesArray[i]) {
        counter++
      }
    }
    sortTasks.push(counter)
  }
  return sortTasks
})

const factLineColor = computed(() => {
  const completedTasksArray = getArrayCompleteTasksByDate(
    completedTasks,
    SimpleArrayOfDates.value,
  )
  const abovePlanCount = completedTasksArray.filter(
    (value, index) => value > PlanLine.value[index],
  ).length

  return abovePlanCount > completedTasksArray.length / 2 ? '#DC3545' : '#13A63A'
})

const data: ApexOptions = {
  chart: {
    type: 'line',
    zoom: {
      enabled: false,
    },
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
      color: factLineColor.value,
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
  <VueApexCharts
    width="570"
    type="line"
    :options="data"
    :series="data.series"
  />
</template>
