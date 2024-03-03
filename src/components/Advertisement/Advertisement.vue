<script lang="ts" setup generic="AdvertisementType">
import { computed } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { AdvertisementProps } from '@Components/Advertisement/Advertisement.types'
import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import DropDown from '@Components/DropDown/DropDown.vue'
import ActionsList from '@Components/ActionsList/ActionsList.vue'

const props = defineProps<AdvertisementProps<AdvertisementType>>()

const AdvertisementClassName = computed(() => [
  'advertisement card rounded-3 shadow',
  props.className ?? '',
])
const AdvertisementHeaderClassName = computed(() => [
  'advertisement__header card-header d-flex justify-content-between align-items-center',
  {
    'bg-primary bg-opacity-50': props.isActive,
  },
])

const getCurrentAdvertisementDate = (createdAt: string) => {
  const currentDateCreated = new Date(
    new Date(createdAt).getTime() -
      new Date(createdAt).getTimezoneOffset() * 60 * 1000,
  )
  const currentDate = new Date()

  const time = useDateFormat(currentDateCreated, 'HH:mm')
  const date = useDateFormat(currentDateCreated, 'DD.MM.YYYY')

  const dateDifference =
    (currentDate.getTime() - currentDateCreated.getTime()) / (1000 * 60 * 60 * 24)

  if (dateDifference === 1) {
    return `вчера в ${time.value}`
  }

  if (dateDifference > 1) {
    return `${date.value} в ${time.value}`
  }

  return time.value
}
</script>

<template>
  <div :class="AdvertisementClassName">
    <div :class="AdvertisementHeaderClassName">
      <Typography class-name="text-primary">{{ sender }}</Typography>

      <div class="d-flex gap-2 align-items-center">
        <span class="text-primary">
          {{ getCurrentAdvertisementDate(createdAt) }}
        </span>

        <template v-if="hasAccessToActions && dropdownActions">
          <Button
            class-name="p-1"
            variant="primary"
            prepend-icon-name="bi bi-list fs-5"
            v-dropdown="'advertisement-actions'"
          />
          <DropDown id="advertisement-actions">
            <ActionsList
              :outside-variable="props.advertisement"
              :actions="dropdownActions"
            />
          </DropDown>
        </template>
      </div>
    </div>

    <div class="card-body py-2">
      {{ text }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.advertisement {
  width: 400px;

  &__header {
    transition: background-color 5s ease-out;
  }
}
</style>
