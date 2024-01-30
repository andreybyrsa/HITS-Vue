<script lang="ts" setup>
import { ref } from 'vue'

import Typography from '@Components/Typography/Typography.vue'
import Button from '@Components/Button/Button.vue'
import ComboBox from '@Components/Inputs/Combobox/Combobox.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Icon from '@Components/Icon/Icon.vue'
import Input from '@Components/Inputs/Input/Input.vue'

import defineAxios from '@Utils/defineAxios'
import { tagsMocks } from '@Utils/getMocks'
import useTagsStore from '@Store/tags/tagsStore'
import { storeToRefs } from 'pinia'
import { Tag } from '@Domain/Tag'

import {
  CreateNewTaskProps,
  CreateTaskModalEmits,
} from '@Components/Modals/TaskModal/TaskModal.types'
import useUserStore from '@Store/user/userStore'
import { useRoute } from 'vue-router'
import useTasksStore from '@Store/tasks/tasksStore'
import { Task } from '@Domain/Project'

const props = defineProps<CreateNewTaskProps>()

const emit = defineEmits<CreateTaskModalEmits>()

const tagsAxios = defineAxios(tagsMocks)

const tagsStore = useTagsStore()
const { tags } = storeToRefs(tagsStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const route = useRoute()

const nameTask = ref('')
const descriptionTask = ref('')
const workHourTask = ref('')

const choosenTags = ref<Tag[]>([])
function confirmedTags(tagsValue: Tag[]) {
  return tagsValue.filter(({ confirmed }) => confirmed)
}
async function createTask() {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const projectId = route.params.id.toString()
    const position = tasks.value.length + 1
    const currentDate = new Date().toJSON().toString()
    const currentTask: Task = {
      id: '',
      projectId: projectId,
      name: nameTask.value,
      description: descriptionTask.value,
      initiator: currentUser,
      executor: null,
      workHour: workHourTask.value,
      position: position,
      startDate: currentDate,
      tag: choosenTags.value,
      taskMovementLog: props.isActiveSprint ? ['NewTask'] : ['InBackLog'],
      status: props.isActiveSprint ? 'NewTask' : 'InBackLog',
    }
    console.log()
    await tasksStore.createTask(currentTask, token)
    emit('close-modal')
  }
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div
      class="task-modal border rounded-4 bg-white ps-4 pe-4 d-flex flex-column gap-2"
    >
      <div class="task-modal__header pt-2 w-100">
        <Header class="fs-4 text-primary w-100">Создание задачи</Header>
        <Button
          @click="emit('close-modal')"
          class-name="fs-5"
          variant="close"
        />
      </div>
      <div class="">
        <Typography class-name="text-primary">Название задачи*</Typography>
      </div>
      <div class="w-100">
        {{ nameTask }}
        <Input
          v-model="nameTask"
          name="name"
          placeholder="Название"
        />
      </div>
      <div class="">
        <Typography class-name="text-primary">Описание задачи*</Typography>
      </div>
      <div class="w-100">
        <Textarea
          v-model="descriptionTask"
          placeholder="Описание"
          name="description"
        ></Textarea>
      </div>
      <div class="w-100">
        <ComboBox
          name="Теги"
          :options="confirmedTags(tags)"
          :display-by="['name']"
          v-model="choosenTags"
          placeholder="Выберите теги"
        ></ComboBox>
      </div>
      <div class="d-flex gap-2">
        <div
          class="d-flex gap-1 py-1"
          v-for="tag in choosenTags"
          :key="tag.id"
        >
          <Icon
            class-name="bi bi-circle-fill"
            :style="{ color: tag.color }"
          />
          <div>{{ tag.name }}</div>
        </div>
      </div>
      <div class="d-flex gap-2 w-100">
        <Typography class-name="text-primary pt-1">Трудоёмкость*</Typography>
        {{ workHourTask }}
        <Input
          v-model="workHourTask"
          name="workHour"
          placeholder="Часы"
        />
      </div>
      <div class="py-3 w-100">
        <Button
          variant="primary"
          class-name="w-100"
          @click="createTask"
          >Создать задачу</Button
        >
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.task-modal {
  width: 450px;
  height: fit-content;
  @include flexible(
    flex-start,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center
  );
  &__header {
    @include flexible(center, space-between);
  }
}
</style>
