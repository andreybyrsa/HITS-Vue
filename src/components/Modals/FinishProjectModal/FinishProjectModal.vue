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
import { AverageMark, ReportProject } from '@Domain/ReportProjectMembers'

import {
  getRoleProjectMember,
  getRoleProjectMemberStyle,
} from '@Utils/getRoleProjectMember'

import {
  FinishProjectModalEmits,
  FinishProjectModalProps,
} from '@Components/Modals/FinishProjectModal/FinishProjectModal.types'
import useTasksStore from '@Store/tasks/tasksStore'
import { Task } from '@Domain/Project'
import useProjectsStore from '@Store/projects/projectsStore'
import Validation from '@Utils/Validation'
import useSprintsStore from '@Store/sprints/sprintsStore'
import {
  RequestConfig,
  openErrorNotification,
  sendParallelRequests,
} from '@Utils/sendParallelRequests'

const isLoading = ref(false)
const refValue = ref()
const report = ref('')

const props = defineProps<FinishProjectModalProps>()

const emit = defineEmits<FinishProjectModalEmits>()

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const averageMark = ref<AverageMark[]>([])

const projectStore = useProjectsStore()
const { projects } = storeToRefs(projectStore)

const sprintStore = useSprintsStore()
const { sprints } = storeToRefs(sprintStore)

onMounted(() => {
  if (props.isFinishProject) getAverageMark()
})

onMounted(() => {
  if (props.isFinishProject) getProject()
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

async function getProject() {
  const currentUser = user.value
  if (currentUser?.token) {
    const { token } = currentUser
    const projectId = route.params.id.toString()

    const response = await ProjectService.getProject(projectId, token)

    if (response instanceof Error) {
      return useNotificationsStore().createSystemNotification(
        'Система',
        response.message,
      )
    }
  }
}

function filterTasksByStatus(tasksAll: Task[]) {
  return tasksAll.filter((value: Task) => value.status !== 'Done')
}

const validationSchemaProject = {
  report: (value: string) =>
    Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
}

const { handleSubmit } = useForm({
  validationSchema: validationSchemaProject,
})

const FinishProject = handleSubmit(async () => {
  isLoading.value = true

  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const projectId = route.params.id.toString()
    const finishDate = new Date().toJSON().toString()

    const finishProjectParallelRequests: RequestConfig[] = [
      {
        request: () => projectStore.changeProjectStatus(projectId, 'DONE', token),
        refValue: refValue,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => projectStore.finishProject(projectId, finishDate, token),
        refValue: refValue,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => projectStore.reportProject(projectId, report.value, token),
        refValue: refValue,
        onErrorFunc: openErrorNotification,
      },
    ]

    await sendParallelRequests(finishProjectParallelRequests)
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
          {{ 'Завершение проекта' }}
        </Typography>

        <Typography
          v-if="status === 'PROJECTINFO'"
          class-name="border-bottom text-primary fs-3 w-100"
        >
          {{ 'Информация о проекте' }}
        </Typography>
        <Button
          @click="emit('close-modal')"
          class-name="fs-5"
          variant="close"
        />
      </div>
      <div class="d-flex w-100 gap-2 flex-column overflow-scroll">
        <div class="d-flex gap-3 text-primary w-100">
          <Typography class-name="w-25">{{ 'Средняя оценка' }}</Typography>

          <Typography class-name="w-75">{{ 'Участник' }}</Typography>
        </div>
        <div
          class="d-flex gap-3 w-100 justify-content-between h-100"
          v-for="(member, index) in averageMark"
          :key="index"
        >
          <div class="w-25 h-100">
            <Input
              v-if="status === 'PROJECT'"
              :name="member.userId"
              class-name="rounded finish-project-modal__input bg-transparent"
              placeholder="Оценка"
              v-model="member.mark"
              disabled
            />
            <Input
              v-if="status === 'PROJECTINFO'"
              :name="member.userId"
              class-name="rounded finish-project-modal__input bg-transparent"
              placeholder="Оценка"
              v-model="member.mark"
              disabled
            />
          </div>

          <ul class="list-group rounded-3 w-75">
            <li
              class="list-group-item p-0 overflow-hidden w-100 w-100 finish-project-modal__input"
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
                      <div class="w-50">{{ task.name }}</div>
                      <div
                        class="w-50 d-flex justify-content-start gap-2 overflow-y-auto p-1"
                      >
                        <div
                          v-for="(tag, index) in task.tags"
                          :key="index"
                          class="d-flex gap-1"
                        >
                          <Icon
                            :style="{ color: tag.color }"
                            class="bi bi-circle-fill"
                          >
                          </Icon>

                          <Typography class-name="finish-project-modal__tag"
                            >{{ tag.name }}
                          </Typography>
                        </div>
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
          v-model="report"
          validate-on-update
        >
          Отчет
        </Textarea>
        <div
          v-for="(project, index) in projects"
          :key="index"
        >
          <Textarea
            v-if="status === 'PROJECTINFO'"
            name="report"
            class-name="finish-project-modal__report rounded w-100 bg-transparent"
            v-model="project.report.report"
            validate-on-update
            disabled
          >
            Отчет
          </Textarea>
        </div>
      </div>

      <Button
        v-if="status === 'PROJECT'"
        @click="FinishProject"
        :is-loading="isLoading"
        :disabled="isLoading"
        variant="primary"
      >
        {{ 'Завершить проект' }}
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
