<script lang="ts" setup>
import { ref, computed, onBeforeMount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import Icon from '@Components/Icon/Icon.vue'
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
import { useRoute } from 'vue-router'

const route = useRoute()
const projectId = route.params.id.toString()

const props = defineProps<SprintFormProps>()
const emit = defineEmits<SprintFormEmits>()

const sprintsStore = useSprintsStore()
const { sprints } = storeToRefs(sprintsStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const initialBackLogTasks = computed<Task[]>(() =>
  tasks.value.filter((task) => task.status === 'InBackLog'),
)

const backlogTasks = ref<Task[]>(initialBackLogTasks.value)
const newSprintTasks = ref<Task[]>([])
const countMembers = ref<number>(1)
const workingHours = ref<number>(1)
const recommendedLoad = ref<number>(1)

const isOpenedCreateNewTask = ref(false)
const isLoading = ref<boolean>(false)

const computedWorkingHoursStyle = computed(() => {
  const style =
    'rounded-end ' +
    (recommendedLoad.value < workingHours.value ? 'text-danger' : 'text-success')
  return style
})

onBeforeMount(async () => {
  countMembers.value = props.project.team.membersCount

  if (props.sprint) {
    newSprintTasks.value = props.sprint.tasks

    setValues({ ...props.sprint })
    return
  }

  const currentDate = new Date()
  const secondDate = new Date()
  secondDate.setDate(currentDate.getDate() + 14)

  const startDate = currentDate.toISOString().substring(0, 10)
  const finishDate = secondDate.toISOString().substring(0, 10)

  setValues({
    name: `Спринт ${sprints.value.length + 1}`,
    startDate,
    finishDate,
    projectId,
  })
})

watch(
  () => newSprintTasks.value,
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
    goal: () => true,
    startDate: (value: string) => Validation.checkDate(value) || 'Поле не заполнено',
    finishDate: (value: string) =>
      Validation.validateDates(values.startDate, value) || 'Поле не заполнено',
    workingHours: (value: number) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
  },
  initialValues: {
    status: 'ACTIVE',
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
  const currentUser = user.value

  if (currentUser?.token && sprint && newSprintTasks.value.length !== 0) {
    const { token } = currentUser

    sprint.tasks = newSprintTasks.value
    sprint.workingHours = workingHours.value.toString()

    await sprintsStore.postSprint(sprint, token)
    emit('close-modal')
  }
})

const UpdateSprint = handleSubmit(async (sprint) => {
  const currentUser = user.value

  if (currentUser?.token && newSprintTasks.value.length !== 0 && props.sprint) {
    const { token } = currentUser

    sprint.tasks = newSprintTasks.value
    sprint.workingHours = workingHours.value.toString()

    await sprintsStore.updateSprint(sprint, props.sprint.id, token)
    emit('close-modal')
  }
})

const getDaysDifference = (startDate: Date, finishDate: Date): number => {
  const daysDifference = Math.round(
    (finishDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  )
  return daysDifference
}

const getWorkingHoursString = () => {
  const startDate = new Date(values.startDate)
  const finishDate = new Date(values.finishDate)
  const daysDifference = getDaysDifference(startDate, finishDate)

  recommendedLoad.value = daysDifference * countMembers.value
  workingHours.value = newSprintTasks.value.reduce(
    (sum, item) => sum + Number(item.workHour),
    0,
  )

  const hintString = `${workingHours.value} / ${recommendedLoad.value}`
  return hintString
}

function openCreateNewTask() {
  isOpenedCreateNewTask.value = true
}

function closeCreateNewTask() {
  isOpenedCreateNewTask.value = false
}
</script>

<template>
  <div class="sprint-form w-100">
    <!-- header -->
    <div class="sprint-form__header w-100">
      <Typography class-name="fs-3 text-primary">
        {{ props.sprint ? 'Редактирование спринта' : 'Создание спринта' }}
      </Typography>

      <Button
        variant="close"
        class="close"
        @click="emit('close-modal')"
      />
    </div>

    <!-- content -->
    <div class="d-flex gap-3 mt-1 w-100">
      <!-- tasks -->
      <div class="sprint-form__content-tasks d-flex gap-4">
        <!-- backlog -->
        <div class="d-flex flex-column w-100">
          <div class="sprint-form__backlog-name border-bottom">
            <Typography class-name="fs-5 text-secondary">Бэклог</Typography>
            <Icon
              class-name="bi bi-plus sprint-form__backlog-add p-1 rounded"
              @click="openCreateNewTask"
            />
          </div>
          <div class="d-flex flex-column mt-3">
            <ProjectTask
              v-for="task in backlogTasks"
              :key="task.id"
              @click="moveTaskToNewTasks(task.id)"
              size="SMALL"
              :task="task"
            />
          </div>
        </div>

        <!-- new-sprint -->
        <div class="d-flex flex-column w-100">
          <div class="border-bottom">
            <Typography class-name="fs-5 text-secondary">Новый спринт</Typography>
          </div>
          <div class="d-flex flex-column mt-3">
            <ProjectTask
              @click="moveTaskToBacklog(task.id)"
              v-for="task in newSprintTasks"
              :key="task.id"
              size="SMALL"
              :task="task"
            />
          </div>
        </div>
      </div>

      <!-- form -->
      <div class="sprint-form__form d-flex flex-column gap-3">
        <!-- inputs -->
        <div class="d-flex flex-column gap-3">
          <Input
            name="name"
            class-name="rounded-end"
            label="Название спринта"
            validate-on-update
            placeholder="Введите название спринта"
          />
          <Textarea
            name="goal"
            class-name="textarea rounded-end"
            label="Цель"
            validate-on-update
            placeholder="Введите цель спринта"
          />
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

        <!-- Кнопки -->
        <Button
          @click="UpdateSprint"
          v-if="props.sprint"
          variant="primary"
          :isLoading="isLoading"
        >
          Сохранить изменения
        </Button>
        <Button
          v-else
          @click="CreateSprint"
          variant="primary"
          :isLoading="isLoading"
          :disabled="newSprintTasks.length == 0"
        >
          Создать спринт
        </Button>
      </div>
    </div>
  </div>

  <TaskModal
    :is-opened="isOpenedCreateNewTask"
    @close-modal="closeCreateNewTask"
  />
</template>

<style lang="scss">
.textarea {
  resize: none;
  height: 100px;
}

.sprint-form {
  @include flexible(flex-start, flex-start, column);

  &__header {
    @include flexible(center, space-between);
  }

  &__content {
    &-tasks {
      width: 70%;
      overflow-y: scroll;
    }
  }

  &__backlog {
    &-name {
      @include flexible(center, space-between);
    }

    &-add {
      transition: all linear 0.15s;
      -webkit-transition: all linear 0.15s;

      &:hover {
        cursor: pointer;
        color: white;
        background-color: rgb(13, 110, 253);
      }
    }
  }

  &__form {
    width: 30%;
  }
}
</style>
