<!-- eslint-disable vue/no-parsing-error -->
<script lang="ts" setup>
import { onUpdated, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDateFormat } from '@vueuse/core'
import { useForm } from 'vee-validate'

import {
  SprintModalProps,
  SprintModalEmits,
} from '@Components/Modals/SprintModal/SprintModal.types'
import Button from '@Components/Button/Button.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Icon from '@Components/Icon/Icon.vue'
import Typography from '@Components/Typography/Typography.vue'
import Collapse from '@Components/Collapse/Collapse.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { Sprint } from '@Domain/Project'
import draggable from 'vuedraggable'
import { getProjectStatus, getProjectStatusStyle } from '@Utils/getProjectStatus'

import useUserStore from '@Store/user/userStore'
import sprintsStore from '@Store/projects/projectsStore'

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  } else {
    return 'Реализуется'
  }
}

const props = defineProps<SprintModalProps>()
const emit = defineEmits<SprintModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isLoading = ref(false)

const taskList = ref([
  {
    name: 'Сделать перевод идей с командами в список проектов ',
    tag: { name: 'Фронтенд', color: '#cd1d1d' },
    id: 1,
  },
  {
    name: 'Сделать перевод идей с командами в список проектов ',
    tag: { name: 'Бэкенд', color: '#279b74' },
    id: 2,
  },
  {
    name: 'Сделать перевод идей с командами в список проектов ',
    tag: { name: 'Фронтенд', color: '#cd1d1d' },
    id: 3,
  },
  {
    name: 'Сделать перевод идей с командами в список проектов ',
    tag: { name: 'Бэкенд', color: '#279b74' },
    id: 4,
  },
])
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div
      v-if="isOpened"
      class="sprint-modal bg-white rounded p-3"
    >
      <div class="d-flex align-items-center justify-content-between border-bottom">
        <Typography class-name="fs-3 text-primary text-center ">
          Спринт: "{{ sprint?.name }}"
        </Typography>

        <Button
          variant="close"
          @click="emit('close-modal')"
        ></Button>
      </div>
      <div class="d-flex gap-2 align-items-center">
        <div :class="getProjectStatusStyle(sprint.status)">
          {{ getProjectStatus().translatedStatus[sprint.status] }}
        </div>
        <Typography class-name="text-primary">Общие часы работы:</Typography>
        {{ sprint?.workingHours }}ч
      </div>
      <ul class="list-group rounded-3">
        <li class="list-group-item p-0 overflow-hidden">
          <Button
            variant="light"
            class-name="collapse-controller w-100"
            v-collapse:openOnMount="sprint?.id"
          >
            Цель спринта:
          </Button>
          <Collapse :id="sprint?.id">
            <div class="p-2">{{ sprint?.goal }}</div>
          </Collapse>
        </li>
      </ul>

      <div class="my-2 d-flex gap-2 w-100">
        <div class="w-100">
          <Typography class-name="text-primary">Начало спринта:</Typography>
          <Button
            variant="light"
            class-name="border w-100"
            >{{ getFormattedDate(sprint?.startDate) }}</Button
          >
        </div>
        <div class="w-100">
          <Typography class-name="text-primary">Конец спринта:</Typography>
          <Button
            variant="light"
            class-name="border w-100"
            >{{ getFormattedDate(sprint?.finishDate) }}</Button
          >
        </div>
      </div>
      <ul class="list-group rounded-3">
        <li class="list-group-item p-0 overflow-hidden">
          <Button
            variant="light"
            class-name="collapse-controller w-100"
            v-collapse:openOnMount="`${sprint?.id}--task-list`"
          >
            Список задач:
          </Button>
          <Collapse :id="`${sprint?.id}--task-list`">
            <template
              v-for="(task, index) in taskList"
              :key="index"
            >
              <div class="my-2 mx-2 p-2 border rounded">
                <div class="active-sprint__task">
                  <Typography>{{ task.name }}</Typography>
                </div>
                <div class="d-flex gap-2">
                  <Icon
                    :style="{ color: task.tag.color }"
                    class-name="bi bi-circle-fill fs-6"
                  />
                  <Typography>{{ task.tag.name }}</Typography>
                </div>
              </div>
            </template>

            <!-- <draggable
              class="h-100 list-group"
              :list="sprintList"
              group="people"
            >
              <template #item="{ element }">
                <div class="my-2 mx-2 p-2 border rounded">
                  <div class="active-sprint__task">
                    <Typography>{{ element.name }}</Typography>
                  </div>
                  <div class="d-flex gap-2">
                    <Icon
                      :style="{ color: element.tag.color }"
                      class-name="bi bi-circle-fill fs-6"
                    />
                    <Typography>{{ element.tag.name }}</Typography>
                  </div>
                </div>
              </template>
            </draggable> -->
          </Collapse>
        </li>
      </ul>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.sprint-modal {
  width: 75ex;
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

.modal-layout-enter-from .sprint-modal,
.modal-layout-leave-to .sprint-modal {
  transform: scale(0.9);
}

.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}
.border-b {
  border-bottom-width: 4px;
}
</style>
