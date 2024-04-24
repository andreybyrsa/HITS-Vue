<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { useRoute } from 'vue-router'

import {
  CreateNewTaskProps,
  CreateTaskModalEmits,
} from '@Components/Modals/TaskModal/TaskModal.types'

import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import ComboBox from '@Components/Inputs/Combobox/Combobox.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Icon from '@Components/Icon/Icon.vue'
import Input from '@Components/Inputs/Input/Input.vue'

import useTagsStore from '@Store/tags/tagsStore'
import useUserStore from '@Store/user/userStore'
import useTasksStore from '@Store/tasks/tasksStore'

import { Tag } from '@Domain/Tag'
import { Task } from '@Domain/Project'

import Validation from '@Utils/Validation'

const props = defineProps<CreateNewTaskProps>()

const emit = defineEmits<CreateTaskModalEmits>()

const tagsStore = useTagsStore()
const { tags } = storeToRefs(tagsStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const tasksStore = useTasksStore()

const route = useRoute()

const choosenTags = ref<Tag[]>([])

function confirmedTags(tagsValue: Tag[]) {
  return tagsValue.filter(({ confirmed }) => confirmed)
}

const isLoading = ref(false)

const { handleSubmit, setValues } = useForm<Task>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
    description: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
    workHour: (value: string) =>
      Validation.checkNumber(value) || 'Неверно введено число',
    tags: (value: Tag[]) => Validation.checkIsEmptyValue(value) || 'Не выбраны теги',
  },
})

watch(
  () => props.isOpened,
  () => {
    if (props.task) {
      choosenTags.value = props.task.tags
      setValues(props.task)
    }
  },
)

const handleCreateTask = handleSubmit(async (task) => {
  const currentUser = user.value

  if (currentUser?.token) {
    isLoading.value = true
    const { token } = currentUser
    const projectId = route.params.projectId.toString()
    task.projectId = projectId

    if (props.sprint) {
      task.position = undefined
      task.status = 'NewTask'
      task.sprintId = props.sprint.id
    }

    await tasksStore.createTask(task, token)

    isLoading.value = false
    emit('close-modal')
  }
})

const handleUpdateTask = handleSubmit(async (task) => {
  const currentUser = user.value

  if (currentUser?.token) {
    isLoading.value = true
    const { token } = currentUser

    await tasksStore.updateTask(task, token)

    isLoading.value = false
    emit('close-modal')
  }
})

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return (
    result &&
    `${parseInt(result[1], 16)},
        ${parseInt(result[2], 16)},
        ${parseInt(result[3], 16)}`
  )
}
</script>

<template>
  <ModalLayout :is-opened="isOpened">
    <div class="add-task-modal border rounded-3 bg-white px-3 py-2">
      <div class="add-task-modal__header w-100">
        <Typography class-name="fs-4 text-primary">
          {{ task ? 'Редактирование задачи' : 'Создание задачи' }}
        </Typography>
        <Button
          @click="emit('close-modal')"
          variant="close"
        />
      </div>

      <Input
        label="Название задачи*"
        class-name="rounded"
        name="name"
        placeholder="Название"
        validate-on-update
      />

      <Textarea
        label="Описание задачи*"
        class-name="add-task-modal__description rounded"
        name="description"
        placeholder="Описание"
        validate-on-update
      />

      <ComboBox
        :options="confirmedTags(tags)"
        :display-by="['name']"
        v-model="choosenTags"
        placeholder="Теги"
        name="tags"
        validate-on-update
      />

      <div class="d-flex flex-wrap gap-2">
        <div
          class="d-flex gap-1"
          v-for="(tag, index) in choosenTags"
          :key="index"
        >
          <Icon
            class-name="bi bi-circle-fill p-1 rounded-2"
            :style="{
              color: tag.color,
              backgroundColor: `rgb(${hexToRgb(tag.color)}, 0.3)`,
            }"
          />
          {{ tag.name }}
        </div>
      </div>

      <div class="d-flex align-items-center gap-2 w-100">
        <Typography class-name="text-primary">Трудоёмкость*</Typography>
        <Input
          class-name="rounded"
          name="workHour"
          placeholder="Часы"
          validate-on-update
        />
      </div>

      <Button
        v-if="task"
        variant="primary"
        class-name="w-100 mb-1"
        :is-loading="isLoading"
        @click="handleUpdateTask"
      >
        Обновить задачу
      </Button>
      <Button
        v-else
        variant="primary"
        class-name="w-100 mb-1"
        :is-loading="isLoading"
        @click="handleCreateTask"
      >
        Создать задачу
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.add-task-modal {
  width: 500px;

  @include flexible(
    flex-start,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  &__header {
    @include flexible(center, space-between);
  }

  &__description {
    resize: none;
    height: 100px;
  }
}

.modal-layout-enter-from .add-tag-modal,
.modal-layout-leave-to .add-tag-modal {
  transform: scale(0.9);
}
</style>
