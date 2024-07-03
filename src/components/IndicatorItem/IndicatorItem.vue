<script lang="ts" setup>
import { IndicatorItemProps } from '@Components/IndicatorItem/IndicatorItem.types'
import { getIndicatorFieldsInfo } from '@Utils/indicatorTranslatedFields'
import { onMounted } from 'vue'

const props = defineProps<IndicatorItemProps>()

const indicatorItemStyle = ['border rounded d-flex flex-column', props.className]

onMounted(() => {
  console.log('indicatorItem', props.indicator)
})
</script>

<template>
  <div :class="indicatorItemStyle">
    <p class="text-primary border-b p-1 m-0">{{ indicator.name }}</p>
    <div class="d-flex gap-2 m-1">
      <p class="w-fit m-0">Кто оценивает:</p>
      <p class="w-fit m-0">
        {{ getIndicatorFieldsInfo().indicatorTranslatedRoles[indicator.role] }}
      </p>
    </div>
    <div class="d-flex gap-2 m-1">
      <p class="w-fit m-0">Кого (что) оценивают:</p>
      <p class="w-fit m-0">
        {{ getIndicatorFieldsInfo().indicatorTranslatedTypes[indicator.type] }}
      </p>
    </div>

    <div class="d-flex gap-2 m-1">
      <p class="w-fit m-0">Категория:</p>
      <p class="w-fit m-0">{{ indicator.categoryName }}</p>
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
