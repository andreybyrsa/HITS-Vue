<script lang="ts" setup>
import {
  FinishSprintModalEmits,
  FinishSprintModalProps,
} from '@Components/Modals/FinishSprintModal/FinishSprintModal.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Radio from '@Components/Inputs/Radio/Radio.vue'
import Icon from '@Components/Icon/Icon.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Collapse from '@Components/Collapse/Collapse.vue'

import { SprintMarks, Task } from '@Domain/Project'
import useProjectsStore from '@Store/projects/projectsStore'
import useSprintsStore from '@Store/sprints/sprintsStore'
import useTasksStore from '@Store/tasks/tasksStore'
import useUserStore from '@Store/user/userStore'
import Validation from '@Utils/Validation'
import {
  RequestConfig,
  openErrorNotification,
  sendParallelRequests,
} from '@Utils/sendParallelRequests'

import {
  getRoleProjectMember,
  getRoleProjectMemberStyle,
} from '@Utils/getRoleProjectMember'

import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AverageMark } from '@Domain/ReportProjectMembers'
import ProjectService from '@Services/ProjectService'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import SprintService from '@Services/SprintService'

const props = defineProps<FinishSprintModalProps>()
const emit = defineEmits<FinishSprintModalEmits>()

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const projectStore = useProjectsStore()
const { projects } = storeToRefs(projectStore)

const sprintStore = useSprintsStore()
const { sprints } = storeToRefs(sprintStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isLoading = ref(false)

const route = useRoute()
const refValue = ref()
const report = ref('')
const radio1 = ref()
const radio2 = ref()

const averageMark = ref<AverageMark[]>([])
const sprintMarks = ref<SprintMarks[]>([])

onMounted(async () => {
  if (props.isFinishSprint) {
    const currentUser = user.value

    if (currentUser?.token) {
      const { token } = currentUser
      const projectId = route.params.id.toString()
      const sprintId = props.activeSprint.id

      const sprintParallelRequests: RequestConfig[] = [
        {
          request: () => ProjectService.getAverageMarkProject(projectId, token),
          refValue: averageMark,
          onErrorFunc: openErrorNotification,
        },
        {
          request: () => SprintService.getMarkSprint(sprintId, token),
          refValue: sprintMarks,
          onErrorFunc: openErrorNotification,
        },
      ]
      await sendParallelRequests(sprintParallelRequests)
    }
  }
})
console.log(averageMark)
console.log(sprintMarks)

const { handleSubmit } = useForm({
  validationSchema: {
    report: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
    radio: (value: boolean) =>
      Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
    mark: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Обязательное поле',
  },
})

const FinishSprint = handleSubmit(async () => {
  isLoading.value = true

  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const sprintID = route.params.id.toString()
    const finishDate = new Date().toJSON().toString()

    const fiinishSprintParallelRequests: RequestConfig[] = [
      {
        request: () => sprintStore.changeSprintStatus(sprintID, 'DONE', token),
        refValue: refValue,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => sprintStore.finishSprint(sprintID, finishDate, token),
        refValue: refValue,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => sprintStore.reportSprint(sprintID, report.value, token),
        refValue: refValue,
        onErrorFunc: openErrorNotification,
      },
    ]

    await sendParallelRequests(fiinishSprintParallelRequests)
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
      {{ sprintMarks }}
      <div class="finish-project-modal__header fs-2 w-100 border-2">
        <Typography class-name="border-bottom text-primary fs-3 w-100">
          {{ 'Завершение спринта' }}
        </Typography>

        <Button
          @click="emit('close-modal')"
          class-name="fs-5"
          variant="close"
        />
      </div>

      <div class="d-flex w-100 gap-2 flex-column overflow-scroll">
        <div class="d-flex gap-3 text-primary w-100">
          <Typography class-name="w-25">{{ 'Оценка' }}</Typography>

          <Typography class-name="w-75">{{ 'Статистика участника' }}</Typography>
        </div>
        <div
          v-for="(sprint, index) in sprintMarks"
          :key="index"
          class="d-flex w-100 gap-2 flex-column"
        >
          <div class="d-flex gap-3 w-100 justify-content-between h-100">
            <div class="w-25 h-100">
              <div class="w-100 h-100">
                <Input
                  name="mark"
                  class-name="rounded finish-project-modal__input"
                  placeholder="Оценка"
                />
              </div>
            </div>

            <ul class="list-group rounded-3 w-75">
              <li class="list-group-item p-0 overflow-hidden w-100">
                <Button
                  variant="light"
                  class-name="collapse-controller w-100 justify-content-between"
                  v-collapse="sprint.userId"
                >
                  {{ sprint.firstName }} {{ sprint.lastName }}
                  <div :class="getRoleProjectMemberStyle(sprint.projectRole)">
                    {{ getRoleProjectMember().translatedRoles[sprint.projectRole] }}
                  </div>
                </Button>

                <Collapse :id="sprint.userId">
                  <div
                    v-if="sprint.tasks"
                    class="fp-2 m-2"
                  >
                    <div class="text-primary">Выполненные задачи*</div>

                    <div
                      v-for="(task, index) in sprint.tasks"
                      :key="index"
                    >
                      <div
                        v-if="task.status === 'Done'"
                        class="d-flex rounded-3 border p-2 mb-1 gap-2 justify-content-between w-100"
                      >
                        <div>{{ task.name }}</div>
                        <div
                          v-for="(tag, index) in task.tag"
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
                </Collapse>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="w-100">
        <div class="mb-2 text-primary">Отчет*</div>
        <Textarea
          name="report"
          class-name="finish-project-modal__report rounded w-100"
          placeholder="Отчет"
          v-model="report"
          validate-on-update
        >
          Отчет
        </Textarea>
      </div>

      <div>
        <div class="text-primary">Перенос незавершенных задач*</div>

        {{ radio1 }}
        {{ radio2 }}
        <Radio
          class-name=""
          name="radio"
          label="Перенести в новый спринт"
          :value="true"
          validate-on-update
        />

        <Radio
          class-name=""
          name="radio"
          label="Перенести в Бэклог"
          :value="false"
          validate-on-update
        />
      </div>

      <Button
        @click="FinishSprint"
        :is-loading="isLoading"
        :disabled="isLoading"
        variant="primary"
      >
        {{ 'Завершить спринт' }}
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
