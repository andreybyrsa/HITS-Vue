<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { watchImmediate } from '@vueuse/core'
import { useForm } from 'vee-validate'

import MarketInputs from '@Components/Forms/MarketForm/MarketFormInputs'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import {
  MarketFormProps,
  MarketFormEmits,
} from '@Components/Forms/MarketForm/MarketForm.types'
import Typography from '@Components/Typography/Typography.vue'

import FormLayout from '@Layouts/FormLayout/FormLayout.vue'

import { Market } from '@Domain/Market'

import useMarketsStore from '@Store/markets/marketsStore'
import useUserStore from '@Store/user/userStore'

import Validation from '@Utils/Validation'

const props = defineProps<MarketFormProps>()
const emit = defineEmits<MarketFormEmits>()

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

watchImmediate(
  () => props.market,
  async (market) => {
    if (market) {
      setValues({ ...market })
    }
  },
)

const createIdeaMarket = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    isLoading.value = true
    await marketsStore.createMarket(values, token)
    isLoading.value = false
  }
})

const updateIdeaMarket = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    isLoading.value = true
    await marketsStore.updateMarket(values, token)
    isLoading.value = false
  }
})

const closeForm = () => {
  emit('close-form')
}
</script>

<template>
  <FormLayout>
    <div class="d-flex align-items-center justify-content-between">
      <Typography class-name="fs-3 text-primary text-center">
        {{ !props.market ? 'Создание биржи' : 'Редактирование биржи' }}
      </Typography>

      <Button
        variant="close"
        @click="closeForm"
      ></Button>
    </div>

    <Input
      v-for="input in MarketInputs"
      :key="input.key"
      class-name="rounded-end"
      :type="input.type"
      :name="input.name"
      :placeholder="input.placeholder"
      validate-on-update
    />

    <Button
      v-if="!props.market"
      type="submit"
      variant="primary"
      @click="createIdeaMarket"
      :is-loading="isLoading"
    >
      Создать биржу
    </Button>
    <Button
      v-if="props.market"
      type="submit"
      variant="primary"
      @click="updateIdeaMarket"
      :is-loading="isLoading"
    >
      Редактировать биржу
    </Button>
  </FormLayout>
</template>

<style>
.my-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
</style>
