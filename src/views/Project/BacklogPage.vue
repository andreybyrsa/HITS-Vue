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
                  <div class="fs-5">{{ element.name }}</div>
                </div>

                <div class="header__block w-50 gap-5 px-3">
                  <div class="header__block gap-1 w-50">
                    <Icon
                      class-name="bi bi-circle-fill "
                      class="fs-3 text-secondary"
                    />
                    {{ element.initiator.firstName }}
                    {{ element.initiator.lastName }}
                  </div>

                  <div class="header__block w-50 gap-2 overflow-x-auto">
                    <div
                      v-for="tag in element.tag"
                      :key="tag.id"
                      class="d-flex gap-1 px-2 py-2 rounded-2 text-center align-self-start"
                      :style="{
                        backgroundColor: `rgb(${hexToRgb(tag.color)}, 0.3)`,
                        color: tag.color,
                      }"
                    >
                      <Icon
                        class-name="bi bi-circle-fill "
                        :style="{ color: tag.color }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Button>
            <Collapse :id="element.id">
              <div class="collapce py-2 mx-3 border-top text-secondary fw-lighter">
                <div class="collapce__block w-75">{{ element.description }}</div>

                <div class="collapce__block-right">
                  <div class="mb-3">
                    Дата: {{ getFormattedDate(element.startDate) }}
                  </div>
                  <div>Трудоемкость: {{ element.workHour }}ч</div>
                </div>
              </div>
            </Collapse>
          </div>
        </template>
      </draggable>

      <div>
        <Button
          class-name="collapse-controller px-0 py-2 fw-bold border-0"
          v-collapse="'taskCollapse'"
        >
          <Typography class-name="fs-4">Другие задачи </Typography>
          <Icon class-name="bi bi-chevron-down fs-3 fw-bold mt-2" />
        </Button>

        <Collapse id="taskCollapse">
          <div
            v-for="(task, index) in otherTasks"
            :key="index"
          >
            <div class="p-0 overflow-hidden mb-3 border rounded-3 bg-light">
              <Button
                variant="light"
                class-name="collapse-controller px-0 py-2 w-100 bg-light"
                v-collapse="task.id"
              >
                <div class="header">
                  <div class="header__block w-75 fw-semibold px-3">
                    <div class="fs-5 fw-bold">
                      {{ getTaskStatusTranslate(task.status) }}
                    </div>
                    <div class="fs-5">{{ task.name }}</div>
                  </div>

                  <div class="header__block w-50 gap-5 px-3">
                    <div class="header__block gap-1 w-50">
                      <Icon
                        class-name="bi bi-circle-fill "
                        class="fs-3 text-secondary"
                      />
                      {{ task.initiator.firstName }}
                      {{ task.initiator.lastName }}
                    </div>

                    <div class="header__block w-50 gap-2 overflow-x-auto">
                      <div
                        v-for="tag in task.tag"
                        :key="tag.id"
                        class="d-flex gap-1 px-2 py-2 rounded-2 text-center align-self-start"
                        :style="{
                          backgroundColor: `rgb(${hexToRgb(tag.color)}, 0.3)`,
                          color: tag.color,
                        }"
                      >
                        <Icon
                          class-name="bi bi-circle-fill "
                          :style="{ color: tag.color }"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Button>
              <Collapse :id="task.id">
                <div class="collapce py-2 mx-3 border-top text-secondary fw-lighter">
                  <div class="collapce__block w-75">{{ task.description }}</div>

                  <div class="collapce__block-right">
                    <div class="mb-3">
                      Дата: {{ getFormattedDate(task.startDate) }}
                    </div>
                    <div>Трудоемкость: {{ task.workHour }}ч</div>
                  </div>
                </div>
              </Collapse>
            </div>
          </div>
        </Collapse>
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
      width: 10%;
    }
  }
}
</style>
