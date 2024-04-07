<template>
  <div class="d-flex gap-3 mt-4">
    <draggable
      class="w-100"
      :list="sortTasks"
      :animation="200"
      :move="move"
      @end="checkMove($event.oldDraggableIndex, $event.newDraggableIndex)"
      group="tasks"
    >
      <template #item="{ element }">
        <ProjectTask :task="element" />
      </template>
    </draggable>

    <div class="d-flex flex-column gap-3 w-25">
      <Button
        variant="primary"
        @click="openCreateNewTask"
        class-name="p-2"
      >
        Создать задачу
      </Button>
      <FilterBar
        class-name="border-start w-100"
        :filters="filters"
      />
    </div>
  </div>

  <TaskModal
    :is-opened="isOpenedCreateNewTask"
    @close-modal="closeCreateNewTask"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'

import Button from '@Components/Button/Button.vue'
import FilterBar from '@Components/FilterBar/FilterBar.vue'
import { Filter } from '@Components/FilterBar/FilterBar.types'
import TaskModal from '@Components/Modals/TaskModal/TaskModal.vue'
import ProjectTask from '@Views/Project/ProjectTask.vue'

import { Task } from '@Domain/Project'
import { Tag } from '@Domain/Tag'

import useTasksStore from '@Store/tasks/tasksStore'
import useUserStore from '@Store/user/userStore'
import useTagsStore from '@Store/tags/tagsStore'
import BackLogTask from '@Components/Tasks/Task/BackLogTask/BackLogTask.vue'

const tagsStore = useTagsStore()
const { tags } = storeToRefs(tagsStore)

const confirmedTags = ref<Tag[]>(tags.value.filter((tag) => tag.confirmed === true))

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const inBackLogTasks = computed<Task[]>(() =>
  tasks.value.filter((task) => task.status === 'InBackLog'),
)

const filterByTags = ref<string[]>([])
const searchByTags = ref('')

const statusOrder = {
  InBackLog: 1,
  OnModification: 2,
  NewTask: 2,
  InProgress: 2,
  OnVerification: 2,
  Done: 3,
}

const sortTasks = computed<Task[]>(() => {
  let arrayTask = [...tasks.value]

  if (filterByTags.value.length) {
    arrayTask = arrayTask.filter(({ tags }) =>
      tags.find((tag) => filterByTags.value.includes(tag.name)),
    )
  }

  return arrayTask.sort((a, b) =>
    a.status === 'InBackLog' && b.status === 'InBackLog' && a.position && b.position
      ? a.position - b.position
      : statusOrder[a.status] - statusOrder[b.status],
  )
})

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

async function checkMove(oldIndex: number, newIndex: number) {
  const currentUser = user.value
  const currentTask = sortTasks.value[newIndex]

  if (currentUser?.token) {
    const { token } = currentUser
    const changeTasks = sortTasks.value.filter(
      ({ status }) => status === 'InBackLog',
    )
    console.log(currentTask.name)

    await tasksStore.changePosition(changeTasks, currentTask, newIndex + 1, token)
  }
}

function move(evt: any) {
  return (
    evt.draggedContext.element.status === 'InBackLog' &&
    filterByTags.value.length === 0 &&
    evt.draggedContext.futureIndex < inBackLogTasks.value.length
  )
}
</script>
