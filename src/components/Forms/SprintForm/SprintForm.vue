<script lang="ts" setup>
import { ref, computed, ComputedRef, onBeforeMount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Button from '@Components/Button/Button.vue'
import {
  SprintFormProps,
  SprintFormEmits,
} from '@Components/Forms/SprintForm/SprintForm.types'
import TaskModal from '@Components/Modals/TaskModal/TaskModal.vue'
import useUserStore from '@Store/user/userStore'

import useSprintsStore from '@Store/sprints/sprintsStore'

import Validation from '@Utils/Validation'
import { Sprint, Task } from '@Domain/Project'

import ProjectTask from '@Views/Project/ProjectTask.vue'
import useTasksStore from '@Store/tasks/tasksStore'
import useProjectsStore from '@Store/projects/projectsStore'
import { useRoute } from 'vue-router'

const route = useRoute()
const projectId = route.params.id.toString()

const props = defineProps<SprintFormProps>()
const emit = defineEmits<SprintFormEmits>()

const sprintsStore = useSprintsStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const projectsStore = useProjectsStore()

const initialBackLogTasks: ComputedRef<Task[]> = computed<Task[]>(() =>
  tasks.value.filter((task) => task.status === 'InBackLog'),
)

const backlogTasks = ref<Task[]>(initialBackLogTasks.value)

const newSprintTasks = ref<Task[]>([])

const isLoading = ref<boolean>(false)

const countMembers = ref<number>(1)

const workingHours = ref<number>(1)

const recommendedLoad = ref<number>(1)

const computedWorkingHoursStyle = computed(() => {
  const style =
    'rounded-end ' +
    (recommendedLoad.value < workingHours.value ? 'text-danger' : 'text-success')
  return style
})

const isOpenedCreateNewTask = ref(false)

function openCreateNewTask() {
  isOpenedCreateNewTask.value = true
}

function closeCreateNewTask() {
  isOpenedCreateNewTask.value = false
}

watch(
  () => tasks,
  (tasks) => {
    const newTasks = tasks.value.filter((task) => {
      if (
        backlogTasks.value.find((item) => item.id == task.id) ||
        newSprintTasks.value.find((item) => item.id == task.id)
      ) {
        return false
      }
      if (task.status === 'InBackLog') return true
    })

    if (newTasks) backlogTasks.value.push(...newTasks)
  },
  { deep: true },
)

const { handleSubmit, setValues, values } = useForm<Sprint>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    goal: (value: string) => true,
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
  if (user.value?.token && sprint && newSprintTasks.value.length !== 0) {
    sprint.tasks = newSprintTasks.value
    sprint.workingHours = workingHours.value.toString()
    const { token } = user.value
    await sprintsStore.postSprint(sprint, token)
    console.log(sprint)

    emit('close-modal')
  }
})

const UpdateSprint = handleSubmit(async (sprint) => {
  if (user.value?.token && sprint && newSprintTasks.value.length !== 0) {
    sprint.tasks = newSprintTasks.value
    sprint.workingHours = workingHours.value.toString()
    const { token } = user.value
    await sprintsStore.updateSprint(sprint, token)
    emit('close-modal')
  }
})

async function emitCreateSprint() {
  CreateSprint()
}

async function emitUpdateSprint() {
  UpdateSprint()
}

const getDaysDifference = (startDate: Date, finishDate: Date): number => {
  const daysDifference = Math.round(
    (finishDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  )
  return daysDifference
}

const getWorkingHoursString = (): string => {
  const startDate = new Date(values.startDate)
  const finishDate = new Date(values.finishDate)
  const daysDifference = getDaysDifference(startDate, finishDate)
  recommendedLoad.value = daysDifference * countMembers.value
  workingHours.value = newSprintTasks.value.reduce(
    (sum, item) => sum + Number(item.workHour),
    0,
  )

  const hintString = workingHours.value.toString() + ` / ${recommendedLoad.value}`
  return hintString
}

onBeforeMount(async () => {
  if (props.sprint) {
    setValues({ ...props.sprint })
    return
  }
  const currentDate: Date = new Date()

  const startDate = currentDate.toISOString().substring(0, 10)

  const secondDate = new Date()
  secondDate.setDate(currentDate.getDate() + 2 * 7)

  const finishDate = secondDate.toISOString().substring(0, 10)

  setValues({ name: 'Спринт', startDate, finishDate, projectId })
  if (user.value?.token) {
    const { token } = user.value
    const project = await projectsStore.getProject(projectId, token)
    if (project instanceof Error) return
    countMembers.value = project.team.members.length
  }
})

watch(
  () => newSprintTasks,
  async (newSprintTasks) => {
    if (newSprintTasks) {
      const workingHoursString = getWorkingHoursString()
      setValues({ workingHours: workingHoursString })
    }
  },
  { deep: true },
)

watch(
  () => values,
  async (values) => {
    if (values) {
      const workingHoursString = getWorkingHoursString()
      setValues({ workingHours: workingHoursString })
    }
  },
  { deep: true },
)
</script>

<template>
  <div class="team-form w-100 bg-white p-3 overflow-auto">
    <div class="left-block width-auto">
      <div class="form-name">
        <Typography class-name="fs-3 text-primary">{{
          props.sprint ? 'Редактирование спринта' : 'Создание спринта'
        }}</Typography>
      </div>

      <div class="tasks">
        <div class="backlog">
          <div class="backlog-name border-bottom border-4">
            <Typography class-name="fs-4 text-secondary">Бэклог</Typography>
          </div>
          <div class="tasks-list d-flex flex-column gap-2">
            <Button
              @click="openCreateNewTask()"
              variant="primary"
              >Создать новую задачу</Button
            >
            <TaskModal
              :is-opened="isOpenedCreateNewTask"
              @close-modal="closeCreateNewTask"
            />
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
          :class-name="computedWorkingHoursStyle"
          label="Общие часы работы"
          type="string"
          validate-on-update
          placeholder="Часы"
        />
      </div>

      <div
        v-tooltip="newSprintTasks.length == 0 && 'в спринте должны быть задачи'"
        v-if="newSprintTasks.length == 0"
      >
        <Button
          @click="emitUpdateSprint()"
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
          :disabled="newSprintTasks.length == 0"
        >
          Создать спринт
        </Button>
      </div>
      <div v-if="newSprintTasks.length != 0">
        <Button
          @click="emitUpdateSprint()"
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
          :disabled="newSprintTasks.length == 0"
        >
          Создать спринт
        </Button>
      </div>
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
