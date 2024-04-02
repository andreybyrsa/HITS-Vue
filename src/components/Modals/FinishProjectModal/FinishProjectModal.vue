<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { watchImmediate } from '@vueuse/core'

import {
  FinishProjectModalEmits,
  FinishProjectModalProps,
} from '@Components/Modals/FinishProjectModal/FinishProjectModal.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import Radio from '@Components/Inputs/Radio/Radio.vue'

import ProjectService from '@Services/ProjectService'
import SprintService from '@Services/SprintService'

import useUserStore from '@Store/user/userStore'
import useProjectsStore from '@Store/projects/projectsStore'
import useSprintsStore from '@Store/sprints/sprintsStore'

import {
  getRoleProjectMember,
  getRoleProjectMemberStyle,
} from '@Utils/getRoleProjectMember'
import Validation from '@Utils/Validation'
import {
  RequestConfig,
  openErrorNotification,
  sendParallelRequests,
} from '@Utils/sendParallelRequests'

import { SprintMarks, Task } from '@Domain/Project'
import { AverageMark } from '@Domain/ReportProjectMembers'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const isLoading = ref(false)
const isLoadingRequest = ref(false)
const report = ref('')

const props = defineProps<FinishProjectModalProps>()

const emit = defineEmits<FinishProjectModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const projectStore = useProjectsStore()
const sprintStore = useSprintsStore()

const route = useRoute()

const averageMark = ref<AverageMark[]>([])
const unfinishedTasks = ref<Task[]>()

watchImmediate(
  () => props.isOpened,
  async (open) => {
    if (open) {
      const currentUser = user.value

      if (currentUser?.token) {
        const { token } = currentUser
        const projectId = route.params.id.toString()
        isLoadingRequest.value = true

        if (!props.sprint) {
          const response = await ProjectService.getAverageMarkProject(
            projectId,
            token,
          )

          if (response instanceof Error) {
            useNotificationsStore().createSystemNotification(
              'Система',
              response.message,
            )
          } else {
            averageMark.value = response
          }
        }

        isLoadingRequest.value = false

        if (props.sprint) {
          unfinishedTasks.value = props.sprint?.tasks.filter(
            ({ status }) => status !== 'Done',
          )

          const arrayUserId = props.members
            .filter(({ projectRole }) => projectRole !== 'INITIATOR')
            .map(({ userId }) => userId)
          arrayUserId.forEach((userId) => {
            validationSchemaModal.value[userId] = (value: string) =>
              Validation.checkNumber(value) || 'Неправильно заполнена форма'
          })
          validationSchemaModal.value['radio'] = (value: string) =>
            Validation.checkIsEmptyValue(value) || 'Это обязательное поле'
        }
      }
    }
  },
)

interface ValidationSchema {
  [key: string]: (value: string) => string | boolean
}

const validationSchemaModal = ref<ValidationSchema>({
  report: (value: string) =>
    Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
})

const { handleSubmit } = useForm({
  validationSchema: validationSchemaModal,
})

const FinishProject = handleSubmit(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const projectId = route.params.id.toString()
    const finishDate = new Date().toJSON().toString()

    isLoading.value = true

    const finishProjectParallelRequests: RequestConfig[] = [
      {
        request: () => projectStore.changeProjectStatus(projectId, 'DONE', token),
        refValue: ref(),
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => projectStore.finishProject(projectId, finishDate, token),
        refValue: ref(),
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => projectStore.reportProject(projectId, report.value, token),
        refValue: ref(),
        onErrorFunc: openErrorNotification,
      },
    ]

    await sendParallelRequests(finishProjectParallelRequests)

    isLoading.value = false
    emit('close-modal')
  }
})

const FinishSprint = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token, id } = currentUser
    const sprintId = props.sprint?.id
    const finishDate = new Date().toJSON().toString()
    isLoading.value = true

    const sprintMarks = props.members.map(
      ({ projectRole, userId, firstName, lastName }) => {
        if (projectRole !== 'INITIATOR') {
          return {
            sprintId,
            userId,
            firstName,
            lastName,
            projectRole,
            mark: values[userId],
            tasks: props.sprint?.tasks.filter(
              ({ executor, status }) => executor?.id === id && status === 'Done',
            ),
          }
        }
      },
    ) as SprintMarks[]

    if (sprintId) {
      const finishSprintParallelRequests: RequestConfig[] = [
        {
          request: () => sprintStore.changeSprintStatus(sprintId, 'DONE', token),
          refValue: ref(),
          onErrorFunc: openErrorNotification,
        },
        {
          request: () => sprintStore.finishSprint(sprintId, finishDate, token),
          refValue: ref(),
          onErrorFunc: openErrorNotification,
        },
        {
          request: () => sprintStore.reportSprint(sprintId, report.value, token),
          refValue: ref(),
          onErrorFunc: openErrorNotification,
        },
        {
          request: () => SprintService.postSprintMarks(sprintMarks, token),
          refValue: ref(),
          onErrorFunc: openErrorNotification,
        },
        // {
        //   request: () =>
        //     tasksStore.changeTaskStatusInBackLog(noDoneTasks, 'InBackLog', token),
        //   refValue: ref(),
        //   onErrorFunc: openErrorNotification,
        // },
      ]
      await sendParallelRequests(finishSprintParallelRequests)
    }
  }

  isLoading.value = false
  emit('close-modal')
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="finish-project bg-white rounded p-3 w-1">
      <div class="finish-project__header w-100">
        <Typography class-name="border-bottom text-primary fs-4 w-100">
          {{ sprint ? 'Завершение спринта' : 'Завершение проекта' }}
        </Typography>
        <Button
          @click="emit('close-modal')"
          variant="close"
        />
      </div>

      <div
        v-if="!isLoadingRequest"
        class="d-flex flex-column gap-2 w-100"
      >
        <div class="d-flex gap-3 text-primary">
          <div class="w-25">
            {{ sprint ? 'Оценка за спринт' : 'Оценка за проект' }}
          </div>
          <div class="w-75">Учасник</div>
        </div>

        <div
          v-if="sprint"
          class="d-flex flex-column gap-2"
        >
          <div
            class="d-flex gap-3"
            v-for="(member, index) in members.filter(
              ({ projectRole }) => projectRole !== 'INITIATOR',
            )"
            :key="index"
          >
            <div class="w-25">
              <Input
                :name="member.userId"
                placeholder="Оценка"
                class-name="rounded"
                :disabled="!Boolean(sprint)"
                validate-on-update
              />
            </div>

            <div class="finish-project__member border rounded px-2 w-75">
              <div class="finish-project__member-name">
                {{ member.firstName }} {{ member.lastName }}
              </div>
              <div :class="getRoleProjectMemberStyle(member.projectRole)">
                {{ getRoleProjectMember().translatedRoles[member.projectRole] }}
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="d-flex flex-column gap-2"
        >
          <div
            class="d-flex gap-3"
            v-for="(member, index) in averageMark"
            :key="index"
          >
            <div class="w-25">
              <Input
                :name="member.userId"
                placeholder="Оценка"
                class-name="rounded"
                v-model="member.mark"
                :disabled="!Boolean(sprint)"
                validate-on-update
              />
            </div>

            <div class="finish-project__member border rounded px-2 w-75">
              <div class="finish-project__member-name">
                {{ member.firstName }} {{ member.lastName }}
              </div>
              <div :class="getRoleProjectMemberStyle(member.projectRole)">
                {{ getRoleProjectMember().translatedRoles[member.projectRole] }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="d-flex flex-column gap-2 w-100"
      >
        <LoadingPlaceholder height="small" />
        <LoadingPlaceholder height="small" />
        <LoadingPlaceholder height="small" />
      </div>

      <div class="w-100">
        <div class="mb-2 text-primary">Отчет*</div>
        <Textarea
          name="report"
          class-name="finish-project__report rounded w-100"
          placeholder="Отчет"
          v-model="report"
          validate-on-update
        >
          Отчет
        </Textarea>
      </div>

      <div v-if="unfinishedTasks?.length">
        <div class="text-primary">Перенос незавершенных задач*</div>
        <Radio
          name="radio"
          label="Перенести в новый спринт"
          :value="true"
          validate-on-update
        />
        <Radio
          name="radio"
          label="Перенести в Бэклог"
          :value="false"
          validate-on-update
        />
      </div>

      <Button
        v-if="props.sprint"
        @click="FinishSprint"
        :is-loading="isLoading"
        :disabled="isLoading"
        variant="primary"
      >
        Завершить спринт
      </Button>
      <Button
        v-else
        @click="FinishProject"
        :is-loading="isLoading"
        :disabled="isLoading"
        variant="primary"
      >
        Завершить проект
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.finish-project {
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

    &-name {
      @include textEllipsis(1);
    }
  }

  &__report {
    resize: none;
    height: 200px;
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

.modal-layout-enter-from .finish-project,
.modal-layout-leave-to .finish-project {
  transform: scale(0.9);
}
</style>
