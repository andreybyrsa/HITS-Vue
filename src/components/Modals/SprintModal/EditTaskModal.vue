<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import useUserStore from '@Store/user/userStore'
import useTasksStore from '@Store/tasks/tasksStore'

import { Task } from '@Domain/Project'

import Validation from '@Utils/Validation'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'

import {
  EditTaskProps,
  EditTaskModalEmits,
} from '@Components/Modals/SprintModal/EditTaskModal.types'

const tasksStore = useTasksStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const props = defineProps<EditTaskProps>()
const emit = defineEmits<EditTaskModalEmits>()

const isLoading = ref(false)

const { handleSubmit, setValues } = useForm<Task>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
    description: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
  },
})

watch(
  () => props.task,
  (task) => {
    setValues({ ...task })
  },
)

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
</script>
<template>
  <ModalLayout :is-opened="isOpened">
    <div class="edit-task-model border rounded-3 bg-white px-3 py-2">
      <div class="edit-task-model__header w-100 border-bottom">
        <Typography class-name="fs-3 text-primary d-flex mx-1">
          Редактирование задачи
        </Typography>

        <Button
          @click="emit('close-modal')"
          variant="close"
        />
      </div>

      <div class="edit-task-model__mid-side w-100">
        <div>
          <div class="pb-3">
            <Textarea
              label="Название задачи*"
              class-name="add-task-modal__description rounded"
              placeholder="Название"
              name="name"
              :model-value="$props.task?.name"
              validate-on-update
            />
          </div>

          <div class="pb-3">
            <Textarea
              label="Описание задачи*"
              class-name="add-task-modal__description rounded"
              placeholder="Описание"
              name="description"
              :model-value="$props.task?.description"
              validate-on-update
            />
          </div>

          <div
            class="pb-3"
            v-if="
              props.task?.status === 'OnModification' && user?.role === 'TEAM_LEADER'
            "
          >
            <Textarea
              label="Комментарий лидера"
              class-name="add-task-modal__description rounded"
              placeholder="Комментарий"
              name="leaderComment"
              :model-value="$props.task?.leaderComment"
              validate-on-update
            />
          </div>

          <div
            class="pb-3"
            v-if="
              props.task?.status === 'OnVerification' &&
              user?.role !== 'TEAM_LEADER' &&
              user?.id === props.task.executor?.id
            "
          >
            <Textarea
              label="Комментарий к задаче"
              class-name="add-task-modal__description rounded"
              placeholder="Комментарий"
              name="executorComment"
              :model-value="$props.task?.executorComment"
              validate-on-update
            />
          </div>
        </div>

        <div class="pt-2">
          <Button
            variant="primary"
            class-name="w-100 mb-1"
            :is-loading="isLoading"
            @click="handleUpdateTask"
          >
            Сохранить изменения
          </Button>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.edit-task-model {
  width: 450px;
  max-height: 800px;
  height: fit-content;

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
}

.add-task-modal {
  &__description {
    resize: none;
    height: 100px;
  }
}
</style>
