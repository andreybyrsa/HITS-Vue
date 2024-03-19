<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
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

import Validation from '@Utils/Validation'

import ProjectTask from '@Views/Project/ProjectTask.vue'

import useTasksStore from '@Store/tasks/tasksStore'
import useUserStore from '@Store/user/userStore'
import useSprintsStore from '@Store/sprints/sprintsStore'

import { Sprint, Task } from '@Domain/Project'
import { useRoute } from 'vue-router'

const props = defineProps<SprintFormProps>()
const emit = defineEmits<SprintFormEmits>()

const sprintsStore = useSprintsStore()
const { sprints } = storeToRefs(sprintsStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const route = useRoute()
const projectId = route.params.id.toString()

const initialBackLogTasks = computed<Task[]>(() =>
  tasks.value.filter((task) => task.status === 'InBackLog'),
)

const backlogTasks = ref<Task[]>(initialBackLogTasks.value)
const newSprintTasks = ref<Task[]>(props.sprint?.tasks ?? [])

const isOpenedCreateNewTask = ref(false)
const isLoading = ref<boolean>(false)

const workingHours = computed<number>(() =>
  newSprintTasks.value.reduce((sum, item) => sum + Number(item.workHour), 0),
)
const recommendedLoad = computed<number>(() => {
  const startDate = new Date(values.startDate)
  const finishDate = new Date(values.finishDate)
  const daysDifference = getDaysDifference(startDate, finishDate)

  return daysDifference * props.project.team.membersCount
})
// const recommendedLoad = computed<number>(() => 8)

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

function updateDate(newStartDate?: string) {
  if (props.sprint && !newStartDate) {
    const currentStartDate = props.sprint.startDate
    const currentFinishDate = props.sprint.finishDate
    return { startDate: currentStartDate, finishDate: currentFinishDate }
  }

  const currentDate = newStartDate ? new Date(newStartDate) : new Date()
  const secondDate = new Date()
  secondDate.setDate(currentDate.getDate() + 14)

  const startDate = currentDate.toISOString().substring(0, 10)
  const finishDate = secondDate.toISOString().substring(0, 10)

  return { startDate, finishDate }
}

const { handleSubmit, setValues, values } = useForm<Sprint>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    goal: () => true,
    startDate: (value: string) => Validation.checkDate(value) || 'Поле не заполнено',
    finishDate: (value: string) =>
      Validation.validateDates(values.startDate, value) || 'Поле не заполнено',
  },
  initialValues: {
    name: props.sprint?.name ?? `Спринт ${sprints.value.length + 1}`,
    status: 'ACTIVE',
    goal: props.sprint?.goal,
    projectId,
    ...updateDate(),
  },
})

watch(values, () => {
  setValues({ ...updateDate(values.startDate) })
})

function moveTaskToNewTasks(currentTask: Task) {
  backlogTasks.value = backlogTasks.value.filter((task) => task !== currentTask)
  newSprintTasks.value.push(currentTask)
  clearTooltips()
}

function moveTaskToBacklog(currentTask: Task) {
  newSprintTasks.value = newSprintTasks.value.filter((task) => task !== currentTask)
  backlogTasks.value.push(currentTask)
  clearTooltips()
}

function clearTooltips() {
  const elementsToRemove = document.querySelectorAll('.tooltip')
  elementsToRemove.forEach((element) => {
    if (element.parentNode) element.parentNode.removeChild(element)
  })
}

const CreateSprint = handleSubmit(async (sprint) => {
  const currentUser = user.value

  if (currentUser?.token && sprint && newSprintTasks.value.length !== 0) {
    const { token } = currentUser
    isLoading.value = true

    sprint.tasks = newSprintTasks.value
    sprint.workingHours = workingHours.value.toString()

    await sprintsStore.postSprint(sprint, token)
    isLoading.value = false
    emit('close-modal')
  }
})

const UpdateSprint = handleSubmit(async (sprint) => {
  const currentUser = user.value

  if (currentUser?.token && newSprintTasks.value.length !== 0 && props.sprint) {
    const { token } = currentUser
    isLoading.value = true

    sprint.tasks = newSprintTasks.value
    sprint.workingHours = workingHours.value.toString()

    await sprintsStore.updateSprint(sprint, props.sprint.id, token)
    isLoading.value = false
    emit('close-modal')
  }
})

const getDaysDifference = (startDate: Date, finishDate: Date) => {
  const daysDifference = Math.round(
    (finishDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  )
  return daysDifference
}

function openCreateNewTask() {
  isOpenedCreateNewTask.value = true
}

function closeCreateNewTask() {
  isOpenedCreateNewTask.value = false
}

function checkworkingHoursTask() {
  return recommendedLoad.value >= workingHours.value
}

function checkDisabledButton() {
  return newSprintTasks.value.length === 0 || !checkworkingHoursTask()
}
</script>

<template>
  <div class="sprint-form w-100 mb-1">
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
              @click="moveTaskToNewTasks(task)"
              size="SMALL"
              :task="task"
            />
          </div>
        </div>

        <!-- new-sprint -->
        <div class="d-flex flex-column w-100">
          <div class="border-bottom">
            <Typography class-name="fs-5 text-secondary">
              Выбранные задачи
            </Typography>
          </div>
          <div class="d-flex flex-column mt-3">
            <ProjectTask
              @click="moveTaskToBacklog(task)"
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
          <div>
            <div class="d-flex gap-1">
              <div
                class="d-flex gap-1"
                :class="checkworkingHoursTask() ? 'text-primary' : 'text-danger'"
              >
                <Icon
                  v-if="!checkworkingHoursTask()"
                  class-name="bi bi-exclamation-circle fs-6"
                />
                Выбранное количество часов:
              </div>
              <div>{{ workingHours }}</div>
            </div>

            <div class="d-flex gap-1">
              <div class="text-primary">Трудомкость команды (часы):</div>
              <div>{{ recommendedLoad }}</div>
            </div>
          </div>
        </div>

        <!-- Кнопки -->
        <Button
          v-if="props.sprint"
          variant="primary"
          @click="UpdateSprint"
          :isLoading="isLoading"
          :disabled="checkDisabledButton()"
        >
          Сохранить изменения
        </Button>
        <Button
          v-else
          variant="primary"
          @click="CreateSprint"
          :isLoading="isLoading"
          :disabled="checkDisabledButton()"
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
  overflow-y: scroll;

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
