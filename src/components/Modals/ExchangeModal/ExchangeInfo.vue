<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import ExchangeInfoProps from '@Components/Modals/ExchangeModal/ExchangeInfo.types'

import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'

defineProps<ExchangeInfoProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>

<template>
  <Typography class-name="p-2 bg-primary rounded-top fs-4 text-center text-white">
    <div>Дата старта</div>
    <div>12.12.2023</div>
  </Typography>

  <div class="exchange-info w-100 pb-3 px-3">
    <div v-if="idea?.customer">
      <Typography class-name="border-bottom text-secondary d-block">
        Заказчик
      </Typography>

      <div class="exchange-info__user pt-2">
        <Icon class-name="bi bi-person-circle text-secondary fs-2 opacity-25" />

        <Typography class-name="text-primary">
          {{ idea.customer }}
        </Typography>
      </div>
    </div>

    <div v-if="idea?.initiator">
      <Typography class-name="border-bottom text-secondary d-block">
        Инициатор
      </Typography>

      <div class="exchange-info__user pt-2">
        <Icon class-name="bi bi-envelope text-secondary fs-2 opacity-25" />

        <Typography class-name="text-primary">
          {{ idea.initiator }}
        </Typography>
      </div>
    </div>

    <Button
      v-if="user?.email == 'kirill.vlasov.05@inbox.ru'"
      class-name="btn-primary"
      >Просмотреть заявки</Button
    >

    <Button
      v-else
      class-name="btn-primary"
      >Подать заявку</Button
    >
  </div>
</template>

<style lang="scss" scoped>
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
