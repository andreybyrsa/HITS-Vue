<template>
  <div class="d-flex gap-3 mt-4">
    <div class="w-100">
      <draggable
        class="list-group rounded-3"
        :list="filteredAndSortedTasks"
        :animation="200"
        @change="checkMove"
        group="tasks"
      >
        <template #item="{ element }">
          <div class="p-0 overflow-hidden mb-3 border rounded-3">
            <Button
              variant="light"
              class-name="collapse-controller px-0 py-2 w-100"
              v-collapse="element.id"
            >
              <div class="header">
                <div class="header__block w-75 fw-semibold px-3">
                  <div
                    class="fs-5 fw-bold"
                    v-if="filterByTags.length <= 0"
                  >
                    #{{ element.position }}
                  </div>
                  <div
                    class="fs-5"
                    @click="openUpdateNewTask"
                  >
                    {{ element.name }}
                  </div>
                </div>

                <div class="header__block w-25 gap-5 px-3">
                  <div class="header__block gap-1 w-50">
                    <Icon
                      class-name="bi bi-circle-fill "
                      class="fs-3 text-secondary"
                    />
                    {{ element.initiator.firstName }}
                    {{ element.initiator.lastName }}
                  </div>

                  <div class="header__block w-50 gap-1">
                    <Icon
                      class-name="bi bi-circle-fill "
                      :style="{ color: element.tag.color }"
                    />
                    <div>{{ element.tag.name }}</div>
                  </div>
                </div>
              </div>
            </Button>
            <Collapse :id="element.id">
              <div class="collapce py-2 mx-3 border-top text-secondary fw-lighter">
                <div class="collapce__block w-75">{{ element.description }}</div>

                <div class="collapce__block-right">
                  <div class="mb-3">Дата: {{ element.startDate }}</div>
                  <div>Трудоемкость: {{ element.workHour }}</div>
                </div>
              </div>
            </Collapse>
          </div>
        </template>
      </draggable>
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
      v-model="tasks"
      @close-modal="closeCreateNewTask"
    />
    <TaskModal
      :is-opened="isOpenedUpdateNewTask"
      v-model="tasks"
      :task="updatingTask"
      @close-modal="closeUpdateNewTask"
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

import { Filter } from '@Components/FilterBar/FilterBar.types'
import { Task } from '@Domain/Project'

import useTasksStore from '@Store/tasks/tasksStore'
import useUserStore from '@Store/user/userStore'
import useTagsStore from '@Store/tags/tagsStore'
import { watchImmediate } from '@vueuse/core'

const tagsStore = useTagsStore()
const { tags } = storeToRefs(tagsStore)

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

const filterByTags = ref<string[]>([])
const searchByTags = ref('')

const filters: Filter<Task>[] = [
  {
    category: 'Теги',
    choices: tags.value.map(({ name }) => ({
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
const isOpenedUpdateNewTask = ref(false)
const updatingTask = ref<Task | null>(null)

function openCreateNewTask() {
  isOpenedCreateNewTask.value = true
}

function closeCreateNewTask() {
  isOpenedCreateNewTask.value = false
}

function openUpdateNewTask(task: Task) {
  updatingTask.value = task
  isOpenedCreateNewTask.value = true
}

function closeUpdateNewTask() {
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
