<script lang="ts" setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'

import {
  TaskDataProps,
  TaskHeaderEmits,
} from '@Components/Modals/ActiveSprintTaskModal/ActiveSprintTaskModal.types'

import ConfirmModal from '@Components/Modals/ConfirmModal/ConfirmModal.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import ComboBox from '@Components/Inputs/Combobox/Combobox.vue'
import Button from '@Components/Button/Button.vue'

import Validation from '@Utils/Validation'

import { Task } from '@Domain/Project'
import { Tag } from '@Domain/Tag'

import useTagsStore from '@Store/tags/tagsStore'
import useUserStore from '@Store/user/userStore'
import useTasksStore from '@Store/tasks/tasksStore'

const tasksStore = useTasksStore()

const tagsStore = useTagsStore()
const { tags } = storeToRefs(tagsStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const props = defineProps<TaskDataProps>()
const emit = defineEmits<TaskHeaderEmits>()

const isEdit = ref(true)
const isLoading = ref(false)
const isOpenedDeleteModal = ref(false)

const choosenTags = ref<Tag[]>(structuredClone(props.task.tags))
const tagsValue = ref<Tag[]>(tags.value.filter(({ confirmed }) => confirmed))

const { handleSubmit, setValues } = useForm<Task>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    description: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    tags: (value: Tag[]) => Validation.checkIsEmptyValue(value) || 'Не выбраны теги',
  },
  initialValues: { ...props.task },
})

const handleUpdateTask = handleSubmit(async (task) => {
  const currentUser = user.value

  if (currentUser?.token) {
    isLoading.value = true
    const { token } = currentUser

    await tasksStore.updateTask(task, token)

    isLoading.value = false
    setValues(task)
    isEdit.value = true
  }
})

async function deleteTask() {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const taskId = props.task.id

    await tasksStore.deleteTask(taskId, token)

    console.log(emit('close-modal'))
    emit('close-modal')
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

function accessEdit() {
  const currentUser = user.value

  if (currentUser) {
    const { executor } = props.task
    const { id: userId } = currentUser

    return (
      (executor?.id === userId ||
        currentUser.role === 'TEAM_LEADER' ||
        currentUser.role === 'INITIATOR') &&
      isEdit.value
    )
  }
}

function allowEdit() {
  isEdit.value = false
}

function cancelEdit() {
  setValues(structuredClone(props.task))
  isEdit.value = true
}

function openDeleteModal() {
  isOpenedDeleteModal.value = true
}

function closeDeleteModal() {
  isOpenedDeleteModal.value = false
}
</script>

<template>
  <div class="task-data p-3 w-100 bg-white rounded">
    <Input
      name="name"
      class-name="rounded-end"
      label="Название*"
      validate-on-update
      placeholder="Введите название задачи"
      :disabled="isEdit"
    />

    <Textarea
      name="description"
      class-name="textarea rounded-end"
      label="Описание*"
      validate-on-update
      placeholder="Введите описание задачи"
      :disabled="isEdit"
    />

    <div class="d-flex flex-column gap-2 w-100">
      <ComboBox
        name="tags"
        :options="tagsValue"
        :display-by="['name']"
        v-model="choosenTags"
        comparing-key="id"
        placeholder="Теги"
        validate-on-update
        :disabled="isEdit"
      />

      <div class="d-flex flex-wrap gap-2">
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

    <div class="d-flex gap-3">
      <Button
        v-if="accessEdit()"
        variant="primary"
        @click="allowEdit"
      >
        Редактировать
      </Button>
      <Button
        v-if="accessEdit()"
        variant="danger"
        @click="openDeleteModal"
      >
        Удалить
      </Button>
      <Button
        v-if="!isEdit"
        variant="success"
        @click="handleUpdateTask"
        :is-loading="isLoading"
      >
        Сохранить
      </Button>
      <Button
        v-if="!isEdit"
        variant="danger"
        @click="cancelEdit"
      >
        Отменить
      </Button>
    </div>
  </div>

  <ConfirmModal
    :is-opened="isOpenedDeleteModal"
    textQuestion="Вы действительно хотите удалить эту задачу?"
    text-button="Удалить"
    @close-modal="closeDeleteModal"
    @action="deleteTask"
  />
</template>

<style lang="scss" scoped>
.task-data {
  @include flexible(flex-start, flex-start, column, $gap: 16px);
}
</style>
