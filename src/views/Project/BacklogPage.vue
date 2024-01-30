<template>
  <div class="d-flex gap-3 mt-4">
    <div class="w-100">
      <ul class="list-group rounded-3">
        <li
          v-for="task in tasks"
          :key="task.id"
          class="list-group-item p-0 overflow-hidden"
        >
          <Button
            variant="light"
            class-name="collapse-controller w-100"
            v-collapse:openOnMount="task.id"
          >
            {{ task.name }}
          </Button>
          <Collapse :id="task.id">
            <div class="p-2">{{ task.description }}</div>
          </Collapse>
        </li>
      </ul>
    </div>

    <div class="d-flex flex-column gap-3">
      <Button
        @click="openCreateNewTask"
        class-name="btn btn-primary text-nowrap p-2 px-5"
        >Создать задачу</Button
      >
      <FilterBar
        class-name=" border-start  w-100"
        :filters="filters"
      />
    </div>
    <TaskModal
      :is-opened="isOpenedCreateNewTask"
      @close-modal="closeCreateNewTask"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Icon from '@Components/Icon/Icon.vue'

import useTasksStore from '@Store/tasks/tasksStore'
import FilterBar from '@Components/FilterBar/FilterBar.vue'
import { Filter, FilterValue } from '@Components/FilterBar/FilterBar.types'
import { Task } from '@Domain/Project'
import { Tag } from '@Domain/Tag'

import draggable from 'vuedraggable'
import useUserStore from '@Store/user/userStore'

import TaskModal from '@Components/Modals/TaskModal/TaskModal.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const inBackLogTasks = ref<Task[]>(
  tasks.value.filter((task) => task.status === 'InBackLog'),
)

const sortedInBackLogTasks = ref<Task[]>(
  inBackLogTasks.value.sort((a, b) => a.position - b.position),
)

const filterByTags = ref<Tag[]>([])

const dragTask = ref<Task | null>(null)

const filters: Filter<Task>[] = [
  {
    category: 'Теги',
    choices: [
      { label: 'Фронтенд', value: 'Фронтенд' },
      { label: 'Бекенд', value: 'Бекенд' },
      { label: 'Рефактор', value: 'Рефактор' },
    ],
    refValue: filterByTags,
    isUniqueChoice: false,
    checkFilter: checkTagConfirmed,
  },
]
const isOpenedCreateNewTask = ref(false)

function checkTagConfirmed(task: Task, tag: FilterValue) {
  return task.tag === tag
}

function handleDragStart(task: Task) {
  dragTask.value = task
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  const taskToDrop = dragTask.value
  if (taskToDrop) {
    // Здесь реализуете логику обновления полей position у задач
    // Например, можно обновить поле position у всех задач в колонке, учитывая новый порядок
    // И отправить обновленные данные на сервер
  }
  dragTask.value = null
}

function checkMove(evt: any) {
  const currentUser = user.value

  if (currentUser) {
    const { token } = currentUser
    const { newIndex, oldIndex } = evt.moved

    if (token) {
      tasksStore.changePosition(
        sortedInBackLogTasks.value,
        newIndex,
        oldIndex,
        token,
      )
    }
  }
}
function openCreateNewTask() {
  isOpenedCreateNewTask.value = true
}
function closeCreateNewTask() {
  isOpenedCreateNewTask.value = false
}
</script>

<style scoped lang="scss">
.collapse-controller {
  border-radius: 0;
  border-bottom: 0;
  background-color: $white-color;

  @include flexible(center, flex-start);
}

.header {
  width: 100%;
  @include flexible(center, space-between);

  &__block {
    @include flexible(center, start, $gap: 12px);
  }
}

.collapce {
  @include flexible(start, space-between);

  &__block {
    @include flexible(start, start);

    &-right {
      width: 10%;
    }
  }
}
</style>
