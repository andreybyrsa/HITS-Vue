<script lang="ts" setup>
import { onUpdated, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDateFormat } from '@vueuse/core'
import { useForm } from 'vee-validate'

import {
  MarketModalProps,
  MarketModalEmits,
  marketModalInputs,
} from '@Components/Modals/MarketModal/MarketModal.types'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Typography from '@Components/Typography/Typography.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { Market } from '@Domain/Market'

import useUserStore from '@Store/user/userStore'
import useMarketsStore from '@Store/markets/marketsStore'

import Validation from '@Utils/Validation'

const props = defineProps<MarketModalProps>()
const emit = defineEmits<MarketModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const marketsStore = useMarketsStore()

const isLoading = ref(false)

const { handleSubmit, setValues } = useForm<Market>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Неверно введено название',
    startDate: (value: string) =>
      Validation.checkDate(value) || 'Неверно введена дата',
    finishDate: (value: string) =>
      Validation.checkDate(value) || 'Неверно введена дата',
  },
})

onUpdated(() => {
  const { isOpened, market } = props

  if (isOpened && market) {
    const startDate = useDateFormat(new Date(market.startDate), 'YYYY-MM-DD').value
    const finishDate = useDateFormat(new Date(market.finishDate), 'YYYY-MM-DD').value

    setValues({ ...market, startDate, finishDate })
  }
})

const createMarket = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    isLoading.value = true
    await marketsStore.createMarket({ ...values, status: 'NEW' }, token)
    isLoading.value = false

    emit('close-modal')
  }
})

const updateMarket = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    isLoading.value = true
    await marketsStore.updateMarket(values, token)
    isLoading.value = false

    emit('close-modal')
  }
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <FormLayout
      v-if="isOpened"
      class-name="market-modal"
    >
      <div class="d-flex align-items-center justify-content-between">
        <Typography class-name="fs-3 text-primary text-center">
          {{ !market ? 'Создание биржи' : 'Редактирование биржи' }}
        </Typography>

        <Button
          variant="close"
          @click="emit('close-modal')"
        ></Button>
      </div>

      <Input
        v-for="(input, index) in marketModalInputs"
        :key="index"
        class-name="rounded-end"
        :type="input.type"
        :name="input.name"
        :placeholder="input.placeholder"
        validate-on-update
      />

      <Button
        v-if="!market"
        type="submit"
        variant="primary"
        @click="createMarket"
        :is-loading="isLoading"
      >
        Создать биржу
      </Button>
      <Button
        v-if="market"
        type="submit"
        variant="primary"
        @click="updateMarket"
        :is-loading="isLoading"
      >
        Сохранить изменения
      </Button>
    </FormLayout>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.market-modal {
  @include flexible(
    stretch,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }
}

.modal-layout-enter-from .market-modal,
.modal-layout-leave-to .market-modal {
  transform: scale(0.9);
}
</style>
