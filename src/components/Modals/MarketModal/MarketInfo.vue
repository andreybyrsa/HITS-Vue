<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import MarketInfoProps from '@Components/Modals/MarketModal/MarketInfo.types'

import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'

import MarketInfoTabs from '@Components/Modals/MarketModal/MarketInfoIdea'

const props = defineProps<MarketInfoProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const dateStart = ref('12.12.2023')
const dateFinish = ref('16.05.2023')
const value = ref()

function valueTab(name: string) {
  if (name == 'Заказчик') {
    return (value.value = props.idea.customer)
  }
  if (name == 'Инициатор') {
    return (value.value = props.idea.initiator)
  }
  if (name == 'Дата старта') {
    return (value.value = dateStart.value)
  }
  if (name == 'Дата окончания') {
    return (value.value = dateFinish.value)
  }
}
</script>

<template>
  <div class="bg-white rounded">
    <div class="exchange-header w-100 bg-primary rounded-top fs-5 text-white p-2">
      Информация
    </div>

    <div class="exchange-info w-100 p-3">
      <div
        v-for="tab in MarketInfoTabs"
        :key="tab.id"
      >
        <Typography class-name="border-bottom text-secondary d-block">
          {{ tab.name }}
        </Typography>

        <div class="exchange-info__user pt-2">
          <Icon :class-name="`${tab.icon} text-secondary fs-2 opacity-25`" />

          <Typography class-name="text-primary">
            {{ valueTab(tab.name) }}
          </Typography>
        </div>
      </div>

      <Button
        v-if="user?.email == idea.initiator"
        class-name="btn-danger"
      >
        Закрыть набор
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.exchange-header {
  @include flexible(center, center);
}
.exchange-info {
  @include flexible(stretch, flex-start, column, $gap: 16px);

  &__user {
    @include flexible(center, flex-start, $gap: 8px);
  }

  &__users {
    @include flexible(stretch, flex-start, column, $gap: 8px);
  }
}
</style>
