<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

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
const searchedTasks = ref<string>()

const tasksSprint = computed<Task[]>(() => {
  const arraytask = ref<Task[]>(props.tasks)

  if (choosenTags.value.length) {
    arraytask.value = arraytask.value.filter((task) =>
      task.tags.find((tag) => choosenTags.value.find(({ id }) => id === tag.id)),
    )
  }

  if (searchedTasks.value) {
    const lowercaseSearch = searchedTasks.value.toLowerCase().trim()

    arraytask.value = arraytask.value.filter((task) => {
      const ideaName = task.name.toLowerCase().trim()

      return ideaName.includes(lowercaseSearch)
    })
  }

  if (choosenInitiator.value) {
    arraytask.value = arraytask.value.filter(
      ({ initiator }) => initiator.id === choosenInitiator.value?.userId,
    )
  }

  return arraytask.value
})

function confirmedTags(tagsValue: Tag[]) {
  return tagsValue.filter(({ confirmed }) => confirmed)
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

function chooseTask(task: Task) {
  currentTask.value = task
}

function checkChooseTask(task: Task) {
  const currentTaskId = currentTask.value?.id

  if (currentTaskId) {
    if (currentTaskId === task.id) return ['border-primary']
    return ['opacity-50']
  }
}
</script>

<template>
  <div class="d-flex flex-column gap-3 w-100 h-100">
    <div class="border-bottom w-100 fs-5 text-primary">
      Задачи: {{ tasksSprint.length }}
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
        v-for="(task, index) in tasksSprint"
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
