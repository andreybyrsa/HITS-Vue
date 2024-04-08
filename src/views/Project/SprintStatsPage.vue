<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import { SprintInfoModalProps } from '@Components/Modals/SprintInfoModal/SprintInfoModal.types'
import Typography from '@Components/Typography/Typography.vue'
import { useDateFormat } from '@vueuse/core'
import SprintChartModal from '@Components/Modals/SprintChartModal/SprintChartModal.vue'
import { ref } from 'vue'
const props = defineProps<SprintInfoModalProps>()

const isOpenedSprintChartModal = ref(false)
function closeSprintChartModal() {
  isOpenedSprintChartModal.value = false
}
function openSprintChartModal() {
  isOpenedSprintChartModal.value = true
}
</script>

<template>
  <div
    class="d-flex mt-2 w-100 flex-column gap-3 overflow-y-scroll sprint-list-page"
  >
    <Button
      variant="outline-dark"
      class-name=" w-100 p-4"
      @click="openSprintChartModal"
    >
      Открыть диаграмму сгорания
    </Button>

    <ul class="list-group rounded-3 w-100">
      <li class="list-group-item p-0 overflow-hidden w-100">
        <Button
          variant="light"
          class-name="collapse-controller w-100"
          v-collapse:openOnMount="321"
        >
          Цель
        </Button>
        <Collapse id="321">
          <div class="p-2">{{ props.sprint?.goal }}</div>
        </Collapse>
      </li>
    </ul>

    <ul class="list-group rounded-3 w-100">
      <li class="list-group-item p-0 overflow-hidden w-100">
        <Button
          variant="light"
          class-name="collapse-controller w-100"
          v-collapse="333"
        >
          Отчет
        </Button>
        <!-- Сделать чтобы колапс не выходил за рамки при обширном тексте -->
        <Collapse id="333">
          <div class="p-2">
            {{ props.sprint?.report }}
          </div>
        </Collapse>
      </li>
    </ul>

    <ul class="list-group rounded-3 w-100">
      <li class="list-group-item p-0 overflow-hidden w-100">
        <Button
          variant="light"
          class-name="collapse-controller w-100"
          v-collapse="125"
        >
          Оценки участников
        </Button>
        <Collapse id="125">
          <div
            v-for="(sprint, index) in props.sprint.marks"
            :key="index"
            class="d-flex"
          >
            <div class="p-2">{{ sprint.firstName }} {{ sprint.lastName }}</div>
            <div class="text-primary py-2">{{ 'Оцнека: ' }} {{ sprint.mark }}</div>
          </div>
        </Collapse>
      </li>
    </ul>
    <div>
      <div class="d-flex gap-1">
        <Typography class-name="text-primary"> {{ 'Начало спринта:' }} </Typography>
        <Typography>
          {{ useDateFormat(props.sprint?.startDate, 'DD.MM.YYYY') }}
        </Typography>
      </div>

      <div class="d-flex gap-1">
        <Typography class-name="text-primary"> {{ 'Конец спринта:' }} </Typography>
        <Typography>
          {{ useDateFormat(props.sprint?.finishDate, 'DD.MM.YYYY') }}
        </Typography>
      </div>

      <div class="d-flex gap-1">
        <Typography class-name="text-primary"> {{ 'Выполнено задач:' }} </Typography>
        <Typography> {{ props.sprint?.tasks.length }} </Typography>
      </div>

      <div class="d-flex gap-1">
        <Typography class-name="text-primary"> {{ 'Потрачено часов:' }} </Typography>
        <Typography> {{ props.sprint?.workingHours }} </Typography>
      </div>
    </div>

    <SprintChartModal
      :is-opened="isOpenedSprintChartModal"
      :sprint="sprint"
      @close-modal="closeSprintChartModal"
    />
  </div>
</template>

<style lang="scss" scoped>
.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}

.sprint-list-page {
  @include flexible(flex-start);
  height: fit-content;
  max-height: 600px;
}
</style>
