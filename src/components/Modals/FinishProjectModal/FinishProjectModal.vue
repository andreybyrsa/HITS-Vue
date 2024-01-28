<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Radio from '@Components/Inputs/Radio/Radio.vue'
import Icon from '@Components/Icon/Icon.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Collapse from '@Components/Collapse/Collapse.vue'

import useUserStore from '@Store/user/userStore'
import ProjectService from '@Services/ProjectService'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import { AverageMark } from '@Domain/ReportProjectMembers'

import {
  getRoleProjectMember,
  getRoleProjectMemberStyle,
} from '@Utils/getRoleProjectMember'

import {
  FinishProjectModalEmits,
  FinishProjectModalProps,
} from '@Components/Modals/FinishProjectModal/FinishProjectModal.types'
import useTasksStore from '@Store/tasks/tasksStore'
import { Project, Sprint, Task } from '@Domain/Project'
import useProjectsStore from '@Store/projects/projectsStore'
import Validation from '@Utils/Validation'
import useSprintsStore from '@Store/sprints/sprintsStore'

const isLoading = ref(false)
const radio1 = ref()
const radio2 = ref()

const props = defineProps<FinishProjectModalProps>()

const emit = defineEmits<FinishProjectModalEmits>()

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const averageMark = ref<AverageMark[]>([])

const projectStore = useProjectsStore()
const sprintStore = useSprintsStore()

const reportProject = ref('')
const reportSprint = ref('')

onMounted(() => {
  if (props.isFinishProject) getAverageMark()
})

async function getAverageMark() {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const projectId = route.params.id.toString()

    const response = await ProjectService.getAverageMarkProject(projectId, token)

    if (response instanceof Error) {
      return useNotificationsStore().createSystemNotification(
        'Система',
        response.message,
      )
    }

    averageMark.value = response
  }
}

function filterTasksByStatus(tasksAll: Task[]) {
  return tasksAll.filter((value: Task) => value.status !== 'Done')
}

const { handleSubmit: a } = useForm<Project>({
  validationSchema: {
    report: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
  },
})

const { handleSubmit: b } = useForm<Sprint>({
  validationSchema: {
    report: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
    // radio: (value: string) =>
    //   Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
  },
})

const FinishProject = a(async () => {
  isLoading.value = true

  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const projectId = route.params.id.toString()
    await projectStore.changeProjectStatus(projectId, 'DONE', token)

    const finishDate = new Date().toJSON().toString()
    await projectStore.finishProject(projectId, finishDate, token)

    await projectStore.reportProject(projectId, reportProject.value, token)

    isLoading.value = false
    emit('close-modal')
  }
})

const FinishSprint = b(async () => {
  isLoading.value = true

  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const sprintID = route.params.id.toString()
    await sprintStore.changeSprintStatus(sprintID, 'DONE', token)

    const finishDate = new Date().toJSON().toString()
    await sprintStore.finishSprint(sprintID, finishDate, token)

    await sprintStore.reportSprint(sprintID, reportSprint.value, token)

    isLoading.value = false
    emit('close-modal')
  }
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="finish-project-modal bg-white rounded p-3 w-1">
      <div class="finish-project-modal__header fs-2 w-100 border-2">
        <Typography
          v-if="status === 'PROJECT'"
          class-name="border-bottom text-primary fs-3 w-100"
        >
          Завершение проекта
        </Typography>

        <Typography
          v-else
          class-name="border-bottom text-primary fs-3 w-100"
        >
          Завершение спринта
        </Typography>
        <Button
          @click="emit('close-modal')"
          class-name="fs-5"
          variant="close"
        />
      </div>
      <div class="d-flex w-100 gap-2 flex-column overflow-scroll">
        <div class="d-flex gap-3 text-primary w-100">
          <Typography
            class-name="w-25"
            v-if="status === 'PROJECT'"
            >Средняя оценка</Typography
          >
          <Typography
            class-name="w-25"
            v-else
            >Оценка</Typography
          >
          <Typography
            v-if="status === 'PROJECT'"
            class-name="w-75"
            >Участник</Typography
          >
          <Typography
            v-else
            class-name="w-75"
            >Статистика участника</Typography
          >
        </div>
        <div
          class="d-flex gap-3 w-100 justify-content-between h-100"
          v-for="(member, index) in averageMark"
          :key="index"
        >
          <div
            v-if="status === 'PROJECT'"
            class="w-25 h-100"
          >
            <Input
              :name="member.id"
              class-name="rounded finish-project-modal__input"
              placeholder="Оценка"
              v-model="member.mark"
            />
          </div>

          <div
            v-else
            class="w-25 h-100"
          >
            <Input
              :name="member.id"
              class-name="rounded finish-project-modal__input"
              placeholder="Оценка"
            />
          </div>

          <ul class="list-group rounded-3 w-75">
            <li
              v-if="status === 'SPRINT'"
              class="list-group-item p-0 overflow-hidden w-100"
            >
              <Button
                variant="light"
                class-name="collapse-controller w-100 justify-content-between"
                v-collapse="member.id"
              >
                {{ member.firstName }} {{ member.lastName }}
                <div :class="getRoleProjectMemberStyle(member.projectRole)">
                  {{ getRoleProjectMember().translatedRoles[member.projectRole] }}
                </div>
              </Button>

              <Collapse :id="member.id">
                <div
                  v-if="member.tasks"
                  class="fp-2 m-2"
                >
                  <div class="text-primary">Выполненные задачи*</div>

                  <div
                    v-for="(task, index) in member.tasks"
                    :key="index"
                  >
                    <div
                      v-if="task.status === 'Done'"
                      class="d-flex rounded-3 border p-2 mb-1 gap-2 justify-content-between w-100"
                    >
                      <div>{{ task.name }}</div>
                      <div class="d-flex gap-1">
                        <Icon
                          :style="{ color: task.tag.color }"
                          class="bi bi-circle-fill"
                        >
                        </Icon>

                        <Typography class-name="finish-project-modal__tag"
                          >{{ task.tag.name }}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </Collapse>
            </li>

            <li
              v-else
              class="list-group-item p-0 overflow-hidden w-100"
            >
              <div
                variant="light"
                class="d-flex w-100 justify-content-between finish-project-modal__member p-2"
              >
                {{ member.firstName }} {{ member.lastName }}
                <div :class="getRoleProjectMemberStyle(member.projectRole)">
                  {{ getRoleProjectMember().translatedRoles[member.projectRole] }}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div
          v-if="status === 'PROJECT'"
          class="w-100"
        >
          <ul class="list-group rounded-3">
            <li class="list-group-item p-0 overflow-hidden">
              <Button
                variant="light"
                class-name="collapse-controller w-100 justify-content-between"
                v-collapse="123"
              >
                <div class="text-primary">Незавершенные задачи*</div>
              </Button>
              <Collapse id="123">
                <div class="flex-column d-flex justify-content-between fp-2 m-2">
                  <div
                    v-for="(task, index) in filterTasksByStatus(tasks)"
                    :key="index"
                  >
                    <div
                      class="d-flex gap-1 justify-content-between border rounded-3 m-1 p-2"
                    >
                      <div>{{ task.name }}</div>
                      <div class="d-flex gap-1">
                        <Icon
                          :style="{ color: task.tag.color }"
                          class="bi bi-circle-fill"
                        >
                        </Icon>
                        {{ task.tag.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </Collapse>
            </li>
          </ul>
        </div>
      </div>

      <div class="w-100">
        <div class="mb-2 text-primary">Отчет*</div>
        <Textarea
          v-if="status === 'PROJECT'"
          name="report"
          class-name="finish-project-modal__report rounded w-100"
          placeholder="Отчет"
          v-model="reportProject"
        >
          Отчет
        </Textarea>

        <Textarea
          v-else
          name="report"
          class-name="finish-project-modal__report rounded w-100"
          placeholder="Отчет"
          v-model="reportSprint"
        >
          Отчет
        </Textarea>
      </div>

      <div v-if="status === 'SPRINT'">
        <div class="text-primary">Перенос незавершенных задач*</div>

        {{ radio1 }}
        {{ radio2 }}
        <Radio
          class-name=""
          name="radio"
          label="Перенести в новый спринт"
          v-model="radio1"
          value=""
          validate-on-update
        />

        <Radio
          class-name=""
          name="radio"
          label="Перенести в Бэклог"
          v-model="radio2"
          value=""
          validate-on-update
        />
      </div>

      <Button
        v-if="status === 'PROJECT'"
        @click="FinishProject"
        :is-loading="isLoading"
        :disabled="isLoading"
        variant="primary"
      >
        Закрыть проект
      </Button>

      <Button
        v-else
        @click="FinishSprint"
        :is-loading="isLoading"
        :disabled="isLoading"
        variant="primary"
      >
        Завершить спринт
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.finish-project-modal {
  width: 600px;
  height: fit-content;
  max-height: 800px;
  @include flexible(
    flex-start,
    flex-start,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }

  &__member {
    @include flexible(center, space-between);
    height: 5vh;
  }

  &__report {
    resize: none;
    height: 200px;
  }

  &__input {
    height: 5vh;
  }

  &__tag {
    @include flexible(center, center);
  }
}

.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  @include flexible(center, flex-start);
}

.modal-layout-enter-from .finish-project-modal,
.modal-layout-leave-to .finish-project-modal {
  transform: scale(0.9);
}
</style>
