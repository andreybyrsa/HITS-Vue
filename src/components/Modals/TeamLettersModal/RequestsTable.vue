<script lang="ts" setup>
import { useDateFormat, useToggle } from '@vueuse/core'
import { useRouter } from 'vue-router'

import RequestsTableProps from '@Components/Modals/TeamLettersModal/RequestsTable.types'
import Button from '@Components/Button/Button.vue'

import { TeamRequest } from '@Domain/TeamRequest'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'

const router = useRouter()

defineProps<RequestsTableProps>()

const [isSorted, setIsSorted] = useToggle(true)

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function sortDate(date: TeamRequest[]) {
  date.sort((a, b) => {
    const A = new Date(a.requestDate).getTime()
    const B = new Date(b.requestDate).getTime()
    return isSorted.value ? B - A : A - B
  })

  setIsSorted()
}
</script>
<template>
  <div class="bg-light rounded-3 border border-primary overflow-y-scroll">
    <span class="d-flex justify-content-between p-2 w-100 text-white bg-primary"
      ><Typography>Тип заявления</Typography>
      <Typography>Заявитель</Typography>
      <Typography
        class="text-white button"
        @click="sortDate(requests)"
        >Дата подачи</Typography
      >
      <Typography class-name="px-3">Действие</Typography></span
    >
    <span
      class="d-flex justify-content-between p-2 w-100 border border-secondary"
      v-for="request in requests"
      :key="request.id"
    >
      <Icon
        v-if="request.type == 'enter'"
        v-tooltip="'Заявление на присоединение в команду'"
        class-name="bi bi-plus-circle text-success bg-transparent fs-5 px-4"
      />
      <Icon
        v-else
        v-tooltip="'Заявление на увольнение'"
        class-name="bi bi-dash-circle text-danger bg-transparent fs-5 px-4"
      />
      <Button @click="router.push(`profile/${request.sender.email}`)">
        {{ request.sender.firstName }}
        {{ request.sender.lastName }}</Button
      >
      <Typography class-name="py-2">{{
        getFormattedDate(request.requestDate)
      }}</Typography>
      <Button
        class="text-start rounded-3 bg-primary text-white"
        @click="
          router.push(`/teams/list/team/${request.teamId}/request/${request.id}`)
        "
      >
        Просмотреть
      </Button>
    </span>
  </div>
</template>
<style lang="scss" scoped>
.button {
  cursor: pointer;
}
</style>
