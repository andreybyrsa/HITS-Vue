<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { debounce } from 'lodash-es'

import { SprintInfoTasksProps } from '@Components/Modals/SprintInfoModal/SprintInfoModal.types'
import Input from '@Components/Inputs/Input/Input.vue'
import ComboBox from '@Components/Inputs/Combobox/Combobox.vue'
import Icon from '@Components/Icon/Icon.vue'
import useTagsStore from '@Store/tags/tagsStore'
import { Tag } from '@Domain/Tag'
import { ProjectMember, Task } from '@Domain/Project'

const tagsStore = useTagsStore()
const { tags } = storeToRefs(tagsStore)

const props = defineProps<SprintInfoTasksProps>()
const currentTask = defineModel<Task>()

const choosenTags = ref<Tag[]>([])
const choosenInitiator = ref<ProjectMember>()
const searchedTasks = ref<string>('')

const filteredTasks = ref<Task[]>(props.tasks)

const updateFilteredTasks = debounce(() => {
  let arraytask = [...props.tasks]

  if (choosenTags.value.length) {
    arraytask = arraytask.filter((task) =>
      task.tags.some((tag) => choosenTags.value.some(({ id }) => id === tag.id)),
    )
  }

  if (searchedTasks.value) {
    const lowercaseSearch = searchedTasks.value.toLowerCase().trim()
    arraytask = arraytask.filter((task) =>
      task.name.toLowerCase().includes(lowercaseSearch),
    )
  }

  if (choosenInitiator.value) {
    arraytask = arraytask.filter(
      ({ executor }) => executor?.id === choosenInitiator.value?.userId,
    )
  }

  filteredTasks.value = arraytask
}, 300)

watch([choosenTags, searchedTasks, choosenInitiator], updateFilteredTasks, {
  immediate: true,
})

function confirmedTags(tagsValue: Tag[]) {
  return tagsValue.filter(({ confirmed }) => confirmed)
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16,
      )}`
    : null
}

function chooseTask(task: Task) {
  currentTask.value = task
}

function checkChooseTask(task: Task) {
  return currentTask.value?.id === task.id ? ['border-primary'] : ['opacity-50']
}
</script>

<template>
  <div class="d-flex flex-column gap-3 w-100 h-100">
    <div class="border-bottom w-100 fs-5 text-primary">
      Задачи: {{ filteredTasks.length }}
    </div>
    <div class="d-flex flex-column gap-2 border-bottom pb-3 w-100">
      <Input
        name="name"
        class-name="rounded"
        placeholder="Поиск"
        v-model="searchedTasks"
      />
      <div class="d-flex flex-column gap-1">
        <ComboBox
          name="tasks-tags"
          placeholder="Теги"
          :options="confirmedTags(tags)"
          v-model="choosenTags"
          :display-by="['name']"
          comparing-key="id"
        />
        <div class="d-flex flex-wrap gap-1">
          <div
            v-for="(tag, index) in choosenTags"
            :key="index"
            :style="{
              backgroundColor: `rgb(${hexToRgb(tag.color)}, 0.3)`,
              color: tag.color,
            }"
            class="px-2 py-1 rounded-2 text-center align-self-start"
          >
            {{ tag.name }}
          </div>
        </div>
      </div>
      <ComboBox
        name="initiator"
        placeholder="Исполнитель"
        :options="members"
        v-model="choosenInitiator"
        :display-by="['firstName', 'lastName']"
        comparing-key="userId"
      />
    </div>
    <div class="d-flex flex-column gap-2 w-100 overflow-y-scroll">
      <div
        v-for="(task, index) in filteredTasks"
        :key="index"
        class="cursor-pointer"
        @click="chooseTask(task)"
      >
        <div
          class="d-flex gap-2 p-2 border rounded"
          :class="checkChooseTask(task)"
        >
          <div class="w-100">{{ task.name }}</div>
          <div class="d-flex flex-column gap-1">
            <div
              v-for="(tag, index) in task.tags"
              :key="index"
            >
              <Icon
                class-name="bi bi-circle-fill p-1 rounded-2"
                :style="{
                  color: tag.color,
                  backgroundColor: `rgb(${hexToRgb(tag.color)}, 0.3)`,
                }"
                v-tooltip="tag.name"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
