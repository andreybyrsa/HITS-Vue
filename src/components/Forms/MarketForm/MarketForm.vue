<script lang="ts" setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import Button from '@Components/Button/Button.vue'
import FormLayout from '@Layouts/FormLayout/FormLayout.vue'
import Validation from '@Utils/Validation'
import MarketInputs from './MarketFormInputs'
import Input from '@Components/Inputs/Input/Input.vue'
import {
  MarketFormProps,
  MarketFormEmits,
} from '@Components/Forms/MarketForm/MarketForm.types'
import Typography from '@Components/Typography/Typography.vue'
import { watchImmediate } from '@vueuse/core'
import useMarketsStore from '@Store/markets/marketsStore'
import useUserStore from '@Store/user/userStore'
import { Market } from '@Domain/Market'
import { storeToRefs } from 'pinia'

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

const marketsStore = useMarketsStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isLoading = ref(false)

const props = defineProps<MarketFormProps>()

const emit = defineEmits<MarketFormEmits>()

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
    <div class="my-div">
      <Typography
        class="name"
        v-if="!props.market"
        class-name="fs-3 text-primary text-center"
        >Создание биржи</Typography
      >
      <Typography
        class="name"
        v-if="props.market"
        class-name="fs-3 text-primary text-center"
        >Редактирование биржи</Typography
      >
      <Button
        class="my-button"
        @click="closeForm"
        variant="close"
      ></Button>
    </div>
    <Input
      v-for="input in MarketInputs"
      :key="input.key"
      validate-on-update
      :type="input.type"
      :name="input.name"
      class-name="rounded-end"
      :placeholder="input.placeholder"
      :prepend="input.prepend"
    />
    <Button
      v-if="!props.market"
      type="submit"
      variant="primary"
      @click="createIdeaMarket"
      :is-loading="isLoading"
      >Создать биржу</Button
    >
    <Button
      v-if="props.market"
      type="submit"
      variant="primary"
      @click="updateIdeaMarket"
      :is-loading="isLoading"
      >Редактировать биржу</Button
    >
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
