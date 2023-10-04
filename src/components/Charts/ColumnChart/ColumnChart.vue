<script lang="ts" setup generic="OptionType">
import { ref, computed } from 'vue'
import { watchImmediate } from '@vueuse/core'

import {
  ColumnChartProps,
  ColumnChartBar,
} from '@Components/Charts/ColumnChart/ColumnChart.types'

const props = defineProps<ColumnChartProps<OptionType>>()

const options = ref<ColumnChartBar[]>([])

const ColumnChartClassName = computed(() => ['chart', props.className])

function getChartBarColor(barAmount: number) {
  if (barAmount < 20) {
    return '#ff001866'
  }
  if (barAmount >= 20 && barAmount < 40) {
    return '#eff21291'
  }
  if (barAmount >= 40 && barAmount < 60) {
    return '#ffb9358c'
  }
  if (barAmount >= 60 && barAmount < 80) {
    return '#0079ea61'
  }
  return '#06e20263'
}

watchImmediate(
  () => props.options,
  (currentOptions) => {
    const columnChartBars: ColumnChartBar[] = []
    const optionsLength = currentOptions.length

    if (optionsLength === 0) {
      return (options.value = [])
    }

    currentOptions.forEach((option) => {
      const currentOption = props.displayBy ? option[props.displayBy] : option

      const optionIsExist = columnChartBars.find(
        (option) => option.label === `${currentOption}`,
      )

      if (!optionIsExist) {
        const optionAmount = currentOptions.reduce((amount, option) => {
          const comparingOption = props.displayBy ? option[props.displayBy] : option
          return comparingOption === currentOption ? (amount += 1) : amount
        }, 0)

        const amount = +((optionAmount * 100) / optionsLength).toFixed(1)

        columnChartBars.push({
          label: `${currentOption}`,
          amount,
          color: getChartBarColor(amount),
        })
      }
    })

    options.value = columnChartBars.sort(
      (prevOption, option) => prevOption.amount - option.amount,
    )
  },
)
</script>

<template>
  <div :class="ColumnChartClassName">
    <div class="chart__columns w-100">
      <div class="chart__y-axis h-100">
        <div
          v-for="value in 10"
          :key="value"
          class="chart__y-axis-value"
        >
          {{ 110 - value * 10 }}
        </div>
      </div>

      <div class="chart__bars w-100 h-100">
        <template v-if="options.length">
          <div
            v-for="bar in options"
            :key="bar.label"
            :style="{
              height: `${bar.amount - 3}%`,
              backgroundColor: bar.color,
            }"
            class="chart__bar"
            v-tooltip="`${bar.label}: ${bar.amount}%`"
          ></div>
        </template>

        <div
          v-else
          v-for="index in 5"
          :key="index"
          :style="{
            height: `${index * 15}%`,
          }"
          class="chart__bar placeholder-glow"
        >
          <div class="h-100 placeholder col-12"></div>
        </div>

        <div
          v-for="value in 5"
          :key="value"
          class="chart__bars-line w-100 border-top"
          :style="{ height: `${value * 20 - 3}%` }"
        ></div>
      </div>
    </div>

    <div class="chart__x-axis w-100 border-top">
      <template v-if="options.length">
        <div
          v-for="bar in options"
          :key="bar.label"
          class="chart__x-axis-label"
        >
          {{ bar.label }}
        </div>
      </template>

      <div
        v-else
        v-for="index in 5"
        :key="index"
        class="chart__x-axis-label chart__x-axis-placeholder placeholder-glow"
      >
        <div
          class="placeholder placeholder-text col-12 rounded"
          :style="{
            width: `${Math.random() * 15 + 20}px`,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart {
  @include flexible(flex-start, stretch, column);

  &__columns {
    @include fixedHeight(350px);

    @include flexible(flex-end, flex-start);
  }

  &__y-axis {
    @include fixedWidth(30px);

    @include flexible(center, stretch, column);

    &-value {
      @include fixedHeight(10%);
    }
  }

  &__bars {
    position: relative;

    @include flexible(flex-end, flex-start, $gap: 5%);

    &-line {
      position: absolute;
    }
  }

  &__bar {
    @include position(relative, $z-index: 1);

    width: 10%;

    transition: all ease-out 0.3s;
  }

  &__x-axis {
    padding-left: 30px;

    @include flexible(center, flex-start, $gap: 5%);

    &-label {
      width: 10%;

      @include flexible(center, center);
    }

    &-placeholder {
      height: 24px;
    }
  }
}

.placeholder-text {
  @include fixedHeight(10px);
}
</style>
