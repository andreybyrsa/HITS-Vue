<script lang="ts" setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import ApexChart, { ApexOptions } from 'apexcharts'
import { Sprint, Task } from '@Domain/Project'
import { sprintMocks } from '@Utils/getMocks'
import { useDateFormat } from '@vueuse/core'
import { SprintChartProps } from '@Components/Modals/SprintModal/BurndownChart.types'
import { date, number } from 'yup'

const prop1 = defineProps<SprintChartProps>()

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
  const end = new Date(endDate)
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

function getArrayOfDatesWithН(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const limiter = getDaysDifference(startDate, endDate)

  const datesArray = []
  if (typeof limiter === 'number') {
    for (let i = 0; i <= limiter; i++) {
      const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)
      datesArray.push(getFormattedDateWithY(currentDate.toISOString()))
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

  let couter = prop1.sprint.tasks.length
  for (let i = 0; i < sortTasks.length; i++) {
    output[i] = couter - sortTasks[i]
    couter -= sortTasks[i]
  }
  return output
}

const ArrayOfDates = computed(() => {
  return getArrayOfDates(prop1.sprint.startDate, prop1.sprint.finishDate)
})

const SimpleArrayOfDates = computed(() => {
  const start = new Date(prop1.sprint.startDate)
  const end = new Date(prop1.sprint.finishDate)
  const limiter = getDaysDifference(prop1.sprint.startDate, prop1.sprint.finishDate)

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
  const totalTasks = prop1.sprint.tasks.length
  if (typeof lengthArrayOfDates === 'number' && lengthArrayOfDates > 0) {
    step = totalTasks / (lengthArrayOfDates - 1)
  }
  for (let i = totalTasks; i >= 0; i -= step) {
    planLine.push(i)
  }
  planLine.push(0)
  return planLine
})

const yAxis = computed(() => {
  let yaxis = []
  for (let i = 0; i <= prop1.sprint.tasks.length; i++) yaxis.push(i)
  return yaxis
})

const tasksProp = computed(() => {
  return prop1.sprint.tasks
})

const completedTasks = tasksProp.value.filter((task) => task.status.includes('Done'))

const factLineColor = computed(() => {
  const completedTasksArray = getArrayCompleteTasksByDate(
    completedTasks,
    SimpleArrayOfDates.value,
  )
  const abovePlanCount = completedTasksArray.filter(
    (value, index) => value > PlanLine.value[index],
  ).length

  return abovePlanCount > completedTasksArray.length / 2 ? '#FF0000' : '#00FF00'
})

const data: ApexOptions = {
  chart: {
    type: 'line',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    offsetX: 20,
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
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ArrayOfDates.value,
    offsetX: 5,
  },
  yaxis: {
    show: false,
  },
  legend: {
    show: true,
  },
  series: [
    {
      name: 'План',
      data: PlanLine.value,
    },
    {
      name: 'Факт',
      data: getArrayCompleteTasksByDate(completedTasks, SimpleArrayOfDates.value),
      color: factLineColor.value,
    },
  ],
  markers: {
    size: [4, 7],
  },
  tooltip: {
    enabled: true,
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      return (
        '<div class="apexcharts-tooltip apexcharts-theme-light">' +
        '<span>' +
        series[seriesIndex][dataPointIndex] +
        '</span>' +
        '</div>'
      )
    },
  },
}
</script>

<template>
  <div class="example">
    <VueApexCharts
      width="500"
      type="line"
      :options="data"
      :series="data.series"
    ></VueApexCharts>
  </div>
</template>
