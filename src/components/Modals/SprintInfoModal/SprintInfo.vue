<script lang="ts" setup>
import { ref } from 'vue'

import Burndown from '@Components/Burndown/Burndown.vue'
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'

import SprintInfoBlock from '@Components/Modals/SprintInfoModal/SprintInfoBlock.vue'
import SprintMarkBlock from '@Components/Modals/SprintInfoModal/SprintMarkBlock.vue'

import { Sprint, SprintMarks } from '@Domain/Project'

defineProps<{ sprint: Sprint; sprintMarks: SprintMarks[] }>()

const isInfoBlock = ref(false)
const isMarksBlock = ref(true)

function getVariant(statement: boolean) {
  return statement ? 'primary' : 'secondary'
}

function getInfoBlock() {
  isInfoBlock.value = true
  isMarksBlock.value = false
}

function getMarksBlock() {
  isInfoBlock.value = false
  isMarksBlock.value = true
}
</script>

<template>
  <div class="d-flex gap-3 w-100">
    <div class="w-75">
      <Burndown :sprint="sprint" />

      <ul
        v-if="sprint.goal"
        class="list-group rounded-3 w-100"
      >
        <li class="list-group-item p-0 overflow-hidden">
          <Button
            variant="light"
            class-name="collapse-controller w-100"
            v-collapse="sprint.goal"
          >
            Описание
          </Button>
          <Collapse :id="sprint.goal">
            <div class="p-2">{{ sprint.goal }}</div>
          </Collapse>
        </li>
      </ul>

      <ul class="list-group rounded-3 w-100">
        <li class="list-group-item p-0 overflow-hidden">
          <Button
            variant="light"
            class-name="collapse-controller w-100"
            v-collapse="sprint.report"
          >
            Отчет
          </Button>
          <Collapse :id="sprint.report">
            <div class="p-2">{{ sprint.report }}</div>
          </Collapse>
        </li>
      </ul>
    </div>
    <div class="d-flex flex-column gap-3 w-25">
      <div class="d-flex gap-1">
        <Button
          :variant="getVariant(isMarksBlock)"
          class-name="w-100"
          @click="getMarksBlock"
        >
          Оценки
        </Button>
        <Button
          :variant="getVariant(isInfoBlock)"
          class-name="w-100"
          @click="getInfoBlock"
        >
          Информация
        </Button>
      </div>

      <SprintInfoBlock
        v-if="isInfoBlock"
        :sprint="sprint"
      />
      <SprintMarkBlock
        v-if="isMarksBlock"
        :sprint-marks="sprintMarks"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}
</style>
