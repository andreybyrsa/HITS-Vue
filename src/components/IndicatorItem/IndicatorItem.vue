<script lang="ts" setup>
import { IndicatorItemProps } from '@Components/IndicatorItem/IndicatorItem.types'

const props = defineProps<IndicatorItemProps>()

const indicatorItemStyle = ['border rounded d-flex flex-column', props.className]

const getIndicatorTranslatedStatus = () => {
  const indicatorType = props.indicator.type
  if (indicatorType == 'TEAM') return 'Оценка команды'
  if (indicatorType == 'INITIATOR') return 'Оценка инициатора'
  if (indicatorType == 'MEMBER') return 'Оценка участника'
  if (indicatorType == 'TEAMLEAD') return 'Оценка команды'
}
</script>

<template>
  <div :class="indicatorItemStyle">
    <p class="text-primary border-b p-1 m-0">{{ indicator.name }}</p>
    <div class="d-flex gap-2 m-1">
      <p class="w-fit m-0">Тип:</p>
      <p class="w-fit m-0">{{ getIndicatorTranslatedStatus() }}</p>
    </div>
    <div class="d-flex gap-2 m-1">
      <p class="w-fit m-0">Категория:</p>
      <p class="w-fit m-0">{{ indicator.nameCategory }}</p>
    </div>
  </div>
</template>

<style>
.w-fit {
  width: fit-content;
}

.border-b {
  border-bottom: 1px solid #dee2e6;
}
</style>
