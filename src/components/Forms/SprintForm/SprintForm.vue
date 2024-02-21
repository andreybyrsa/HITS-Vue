<script lang="ts" setup>
import { ref, computed, ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { watchImmediate } from '@vueuse/core'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Button from '@Components/Button/Button.vue'
import {
  SprintFormProps,
  SprintFormEmits,
} from '@Components/Forms/SprintForm/SprintForm.types'

import useUserStore from '@Store/user/userStore'

import useSprintsStore from '@Store/sprints/sprintsStore'

import Validation from '@Utils/Validation'
import { Sprint, Task } from '@Domain/Project'

import ProjectTask from '@Views/Project/ProjectTask.vue'
import useTasksStore from '@Store/tasks/tasksStore'

const props = defineProps<SprintFormProps>()
const emit = defineEmits<SprintFormEmits>()

const sprintsStore = useSprintsStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const initialBackLogTasks: ComputedRef<Task[]> = computed<Task[]>(() =>
  tasks.value.filter((task) => task.status === 'InBackLog'),
)

const backlogTasks = ref<Task[]>(initialBackLogTasks.value)

const newSprintTasks = ref<Task[]>([])

const isLoading = ref<boolean>(false)

const { handleSubmit, setValues, values } = useForm<Sprint>({
  validationSchema: {
    // tasks: (value: Task[]) =>
    //   Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    goal: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    startDate: (value: string) => Validation.checkDate(value) || 'Поле не заполнено',
    finishDate: (value: string) =>
      Validation.validateDates(values.startDate, value) || 'Поле не заполнено',
    workingHours: (value: number) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
  },
})

function moveTaskToNewTasks(id: string) {
  const choosenTask = backlogTasks.value.find((task) => task.id == id)
  backlogTasks.value = backlogTasks.value.filter((task) => task.id !== id)
  if (choosenTask) newSprintTasks.value.push(choosenTask)
  clearTooltips()
}

function clearTooltips() {
  const elementsToRemove = document.querySelectorAll('.tooltip')
  elementsToRemove.forEach((element) => {
    if (element.parentNode) element.parentNode.removeChild(element)
  })
}

function moveTaskToBacklog(id: string) {
  const choosenTask = newSprintTasks.value.find((task) => task.id == id)
  newSprintTasks.value = newSprintTasks.value.filter((task) => task.id !== id)
  if (choosenTask) backlogTasks.value.push(choosenTask)
  clearTooltips()
}

const CreateSprint = handleSubmit(async (sprint) => {
  sprint.tasks = newSprintTasks.value
  sprint.projectId = newSprintTasks.value[0].projectId

  if (user.value?.token && sprint) {
    const { token } = user.value
    await sprintsStore.postSprint(sprint, token)
    emit('close-modal')
  }
})

async function emitCreateSprint() {
  CreateSprint()
}

watchImmediate(
  () => props.sprint,
  async (sprint) => {
    if (sprint) {
      setValues({ ...sprint })
    }
  },
)

watchImmediate(
  () => newSprintTasks,
  async (newSprintTasks) => {
    if (newSprintTasks) {
      const workingHours = newSprintTasks.value.reduce(
        (sum, item) => sum + Number(item.workHour),
        0,
      )

      setValues({ workingHours: workingHours.toString() })
    }
  },
  { deep: true },
)
</script>

<template>
  <div class="team-form w-100 bg-white p-3 overflow-auto">
    <div class="left-block width-auto">
      <div class="form-name">
        <Typography class-name="fs-3 text-primary">Создание спринта</Typography>
      </div>

      <div class="tasks">
        <div class="backlog">
          <div class="backlog-name border-bottom border-4">
            <Typography class-name="fs-4 text-secondary">Бэклог</Typography>
          </div>
          <div class="tasks-list d-flex flex-column gap-2">
            <ProjectTask
              @click="moveTaskToNewTasks(task.id)"
              v-for="task in backlogTasks"
              :key="task.id"
              :size="'SMALL'"
              :task="task"
            />
          </div>
        </div>
        <div class="new-sprint">
          <div class="new-sprint-name border-bottom border-4">
            <Typography class-name="fs-4 text-secondary">Новый спринт</Typography>
          </div>
          <div class="tasks-list d-flex flex-column gap-2">
            <ProjectTask
              name="tasks"
              @click="moveTaskToBacklog(task.id)"
              v-for="task in newSprintTasks"
              :key="task.id"
              :size="'SMALL'"
              :task="task"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="right-block">
      <div class="form">
        <Button
          variant="close"
          class="close"
          @click="emit('close-modal')"
        ></Button>
        <Input
          name="name"
          class-name="rounded-end"
          label="Название спринта"
          validate-on-update
          placeholder="Введите название спринта"
        />
        <Textarea
          name="goal"
          class-name="rounded-end"
          label="Цель"
          validate-on-update
          placeholder="Введите цель спринта"
        ></Textarea>

        <Input
          name="startDate"
          class-name="rounded-end"
          label="Начало спринта"
          type="date"
          validate-on-update
          placeholder=".. | .. | .."
        />
        <Input
          name="finishDate"
          class-name="rounded-end"
          label="Конец спринта"
          type="date"
          validate-on-update
          placeholder=".. | .. | .."
        />
        <Input
          disabled
          name="workingHours"
          class-name="rounded-end"
          label="Общие часы работы"
          type="number"
          validate-on-update
          placeholder="Часы"
        />
      </div>

      <Button
        v-if="props.sprint"
        variant="primary"
        class-name="w-75"
        :isLoading="isLoading"
      >
        Сохранить изменения
      </Button>
      <Button
        v-else
        @click="emitCreateSprint()"
        variant="primary"
        class-name="w-75"
        :isLoading="isLoading"
      >
        Создать спринт
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.close {
  justify-self: end;
}
.tasks-list {
  display: flex;
  padding: 7px 0;
}
.left-block {
  display: flex;
  justify-content: start;
  flex-direction: column;
  width: 66.66%;
  padding: 0 3rem;
}

.line {
  width: 11px;
  height: auto;
  background-color: gray;
}

.right-block {
  width: 33.33%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.form {
  display: grid;
  gap: 1rem;
}

.form-name {
  margin-bottom: 2rem;
}

.tasks {
  width: auto;
  display: flex;
  justify-content: space-between;
  overflow-y: scroll;
  padding: 0 10px;
}

.backlog {
  width: 45%;
}

.new-sprint {
  width: 45%;
}

.team-form {
  display: flex;
  justify-content: space-between;
  border-color: gray;
  height: 100%;
  // @include flexible(flex-start, center);

  // &__content {
  //   @include flexible(center, flex-start, column, $gap: 16px);
  // }
}
.team-invite-form {
  width: 100%;
  @include flexible(start, start, column);

  &__main {
    width: 100%;
    @include flexible(start, start);
  }
}
</style>
