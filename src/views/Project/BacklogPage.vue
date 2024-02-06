<template>
  <div class="d-flex gap-3 mt-4">
    <div class="w-100">
      <draggable
        class="list-group"
        :list="filteredAndSortedTasks"
        :animation="200"
        @change="checkMove"
        group="tasks"
      >
        <template #item="{ element }">
          <ProjectTask :task="element" />
        </template>
      </draggable>

      <div>
        <div
          v-for="(task, index) in otherTasks"
          :key="index"
        >
          <ProjectTask :task="task" />
        </div>
      </div>
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
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'

import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Icon from '@Components/Icon/Icon.vue'
import FilterBar from '@Components/FilterBar/FilterBar.vue'
import ProjectTask from '@Views/Project/ProjectTask.vue'

import { Filter } from '@Components/FilterBar/FilterBar.types'
import { Task } from '@Domain/Project'

import useTasksStore from '@Store/tasks/tasksStore'
import useUserStore from '@Store/user/userStore'
import useTagsStore from '@Store/tags/tagsStore'
import { useDateFormat, watchImmediate } from '@vueuse/core'
import { Tag } from '@Domain/Tag'
import Typography from '@Components/Typography/Typography.vue'
import TaskModal from '@Components/Modals/TaskModal/TaskModal.vue'

const tagsStore = useTagsStore()
const { tags } = storeToRefs(tagsStore)

const confirmedTags = ref<Tag[]>(tags.value.filter((tag) => tag.confirmed === true))

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const inBackLogTasks = computed<Task[]>(() => {
  return tasks.value.filter((task) => task.status === 'InBackLog')
})

const otherTasks = computed<Task[]>(() => {
  return sortOtherTasks(tasks.value)
})

const sortedInBackLogTasks = computed<Task[]>(() => {
  const currentSortedTasks = [...inBackLogTasks.value].sort(
    (a, b) => a.position - b.position,
  )

  return currentSortedTasks
})

const filterByTags = ref<string[]>([])
const searchByTags = ref('')

const filters: Filter<Task>[] = [
  {
    category: 'Теги',
    choices: confirmedTags.value.map(({ name }) => ({
      label: name,
      value: name,
    })),
    refValue: filterByTags,
    isUniqueChoice: false,
    searchValue: searchByTags,
    checkFilter: () => true,
  },
]
const isOpenedCreateNewTask = ref(false)

function openCreateNewTask() {
  isOpenedCreateNewTask.value = true
}

function closeCreateNewTask() {
  isOpenedCreateNewTask.value = false
}

const filteredAndSortedTasks = ref<Task[]>([...sortedInBackLogTasks.value])

const compfilteredAndSortedTasks = computed(() => {
  const tasks = filtertTasks(sortedInBackLogTasks.value, filterByTags.value)

  return tasks
})

watchImmediate(
  compfilteredAndSortedTasks,
  () => (filteredAndSortedTasks.value = compfilteredAndSortedTasks.value),
)

function checkMove(evt: any) {
  const currentUser = user.value

  if (currentUser && filterByTags.value.length <= 0) {
    const { token } = currentUser
    const { newIndex, oldIndex } = evt.moved

    if (token) {
      tasksStore.changePosition(
        filteredAndSortedTasks.value,
        newIndex,
        oldIndex,
        token,
      )
    }
  }
}

function filtertTasks(tasks: Task[], filters: string[]): Task[] {
  if (filterByTags.value.length > 0) {
    return tasks.filter((task) =>
      filters.some((filter) => task.tag.find(({ name }) => name === filter)),
    )
  } else {
    return sortedInBackLogTasks.value
  }
}

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return (
    result &&
    `${parseInt(result[1], 16)},
        ${parseInt(result[2], 16)},
        ${parseInt(result[3], 16)}`
  )
}

function getFormattedDate(date: string) {
  if (date) {
    const formattedDate = useDateFormat(new Date(date), 'DD.MM.YYYY')
    return formattedDate.value
  }
}

function getTaskStatusTranslate(status: string) {
  if (
    status === 'OnModification' ||
    status === 'NewTask' ||
    status === 'inProgress' ||
    status === 'OnVerification'
  ) {
    return 'Спринт'
  } else if (status === 'Done') {
    return 'Завершено'
  }
}

function sortOtherTasks(tasks: Task[]): Task[] {
  const excludedStatuses = ['InBackLog']
  const firstStatuses = ['OnModification', 'NewTask', 'inProgress', 'OnVerification']

  const filteredTasks = tasks.filter(
    (task) => !excludedStatuses.includes(task.status),
  )

  return filteredTasks.sort((a, b) => {
    if (firstStatuses.includes(a.status) && !firstStatuses.includes(b.status)) {
      return -1
    }
    if (!firstStatuses.includes(a.status) && firstStatuses.includes(b.status)) {
      return 1
    }
    if (a.status === 'Done' && b.status !== 'Done') {
      return 1
    }
    if (a.status !== 'Done' && b.status === 'Done') {
      return -1
    }
    return 0
  })
}
</script>

<style scoped lang="scss">
.collapse-controller {
  border-radius: 0;
  border-bottom: 0;
  background-color: $white-color;

  @include flexible(center, flex-start, $gap: 24px);
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
      width: 17%;
    }
  }
}
</style>
