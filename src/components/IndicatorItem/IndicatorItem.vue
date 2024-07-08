<script lang="ts" setup>
import { IndicatorItemProps } from '@Components/IndicatorItem/IndicatorItem.types'
import { getIndicatorFieldsInfo } from '@Utils/indicatorTranslatedFields'
import Button from '@Components/Button/Button.vue'
import useIndicatorStore from '@Store/indicators/indicatorsStore'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'

const props = defineProps<IndicatorItemProps>()

const indicatorItemStyle = [
  'border',
  'rounded',
  'd-flex',
  'flex-column',
  props.className,
]

const indicatorStore = useIndicatorStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const deleteIndicator = async () => {
  const token = user.value?.token
  if (!token) return
  await indicatorStore.deleteIndicator(props.indicator.id, token)
}
</script>

<template>
  <div :class="indicatorItemStyle">
    <div class="d-flex justify-content-between align-items-center border-b p-1">
      <p class="text-primary m-0">{{ indicator.name }}</p>
      <Button
        @click.stop="deleteIndicator"
        variant="close"
      ></Button>
    </div>
    <div class="d-flex gap-2 m-1">
      <p class="w-fit m-0">Кто оценивает:</p>
      <p class="w-fit m-0">
        {{ getIndicatorFieldsInfo().indicatorTranslatedRoles[indicator.role] }}
      </p>
    </div>
    <div class="d-flex gap-2 m-1">
      <p class="w-fit m-0">Кого (что) оценивают:</p>
      <p class="w-fit m-0">
        {{
          getIndicatorFieldsInfo().indicatorTranslatedTypesForIndicatorModal[
            indicator.type
          ]
        }}
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
