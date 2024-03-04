<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useUserStore, useIdeasMarketStore } from '@Store'
import {
  IdeasMarketHeaderProps,
  IdeasMarketHeaderEmits,
} from '@Views/IdeasMarket/IdeasMarketView.types'
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import CloseIdeasMarketModal from '@Components/Modals/CloseIdeasMarketModal/CloseIdeasMarketModal.vue'
import Icon from '@Components/Icon/Icon.vue'

const props = defineProps<IdeasMarketHeaderProps>()
const emit = defineEmits<IdeasMarketHeaderEmits>()
const searchedValue = defineModel<string>({ required: true })

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const ideasMarketStore = useIdeasMarketStore()
const { ideasMarket } = storeToRefs(ideasMarketStore)

const isOpenedClosingIdeasMarketModal = ref(false)

const ideasMarketWithOpenedRecruitment = computed(() =>
  ideasMarket.value.filter(({ status }) => status === 'RECRUITMENT_IS_OPEN'),
)

function getAccessToCloseMarket() {
  const role = user.value?.role
  const marketStatus = props.market?.status

  return (role === 'ADMIN' || role === 'PROJECT_OFFICE') && marketStatus === 'ACTIVE'
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function getNavTabClass(isAllIdeas: boolean) {
  const initialClass = ['nav-link', 'cursor-pointer']
  if (isAllIdeas) {
    initialClass.push('active', 'text-primary')
    return initialClass
  }
  initialClass.push('text-dark')
  return initialClass
}

function openClosingIdeasMarketModal() {
  isOpenedClosingIdeasMarketModal.value = true
}

function closeClosingIdeasMarketModal() {
  isOpenedClosingIdeasMarketModal.value = false
}
</script>

<template>
  <div class="w-100 d-flex flex-column">
    <template v-if="market">
      <Typography class-name="fs-2 text-primary">
        {{ market.name }}
      </Typography>
      <Typography class-name="text-secondary">
        {{ getFormattedDate(market.startDate) }} -
        {{ getFormattedDate(market.finishDate) }}
      </Typography>
    </template>

    <template v-else>
      <div class="w-25">
        <LoadingPlaceholder />

        <div class="w-50 d-flex gap-3">
          <LoadingPlaceholder />

          <LoadingPlaceholder />
        </div>
      </div>
    </template>
  </div>

  <div class="nav nav-underline mb-3 w-100 d-flex justify-content-center">
    <div
      :class="getNavTabClass(isAllIdeas === true)"
      @click="emit('switch-to-all')"
    >
      Все
    </div>
    <div
      :class="getNavTabClass(isAllIdeas === false)"
      @click="emit('switch-to-favourites')"
    >
      Избранное
    </div>
  </div>

  <div class="d-flex justify-content-between align-items-center mb-3 w-100">
    <div class="w-50">
      <Input
        name="search"
        class-name="rounded-end"
        no-form-controlled
        v-model="searchedValue"
        placeholder="Поиск"
      >
        <template #prepend>
          <Icon class-name="bi bi-search" />
        </template>
      </Input>
    </div>

    <div>
      <Button
        v-if="getAccessToCloseMarket()"
        variant="danger"
        @click="openClosingIdeasMarketModal"
      >
        Закрыть биржу
      </Button>
    </div>
  </div>

  <CloseIdeasMarketModal
    v-if="market"
    :is-opened="isOpenedClosingIdeasMarketModal"
    :ideasMarket="ideasMarketWithOpenedRecruitment"
    :market="market"
    @close-modal="closeClosingIdeasMarketModal"
  />
</template>
