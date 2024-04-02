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
import SprintService from '@Services/SprintService'
import { reactiveComputed } from '@vueuse/core'

const props = defineProps<FinishSprintModalProps>()
const emit = defineEmits<FinishSprintModalEmits>()

const tasksStore = useTasksStore()
const { tasks } = storeToRefs(tasksStore)

const sprintStore = useSprintsStore()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isLoading = ref(false)

const route = useRoute()
const refValue = ref()
const report = ref('')

const averageMark = ref<AverageMark[]>([])
const sprintMarks = ref<SprintMarks[]>([])

const getValidations = ref<any>({
  report: (value: string) =>
    Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
  radio: (value: boolean) =>
    Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
})

const noDoneTasks = reactiveComputed<Task[]>(() =>
  tasks.value.filter(({ status }) => status !== 'Done'),
)

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

      const arrayUserId = sprintMarks.value.map(({ userId }) => userId)
      arrayUserId.forEach((userId) => {
        getValidations.value[userId] = (value: boolean) =>
          Validation.checkIsEmptyValue(value) || 'Обязательное поле'
      })
    }
  }
})

const { handleSubmit } = useForm({
  validationSchema: getValidations,
})

const FinishSprint = handleSubmit(async () => {
  isLoading.value = true

  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const sprintId = props.activeSprint.id
    const finishDate = new Date().toJSON().toString()

    const fiinishSprintParallelRequests: RequestConfig[] = [
      {
        request: () => sprintStore.changeSprintStatus(sprintId, 'DONE', token),
        refValue: refValue,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => sprintStore.finishSprint(sprintId, finishDate, token),
        refValue: refValue,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () => sprintStore.reportSprint(sprintId, report.value, token),
        refValue: refValue,
        onErrorFunc: openErrorNotification,
      },
      {
        request: () =>
          tasksStore.changeTaskStatusInBackLog(noDoneTasks, 'InBackLog', token),
        refValue: refValue,
        onErrorFunc: openErrorNotification,
      },
    ]

    await sendParallelRequests(fiinishSprintParallelRequests)
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
    <div class="finish-sprint bg-white rounded p-3 w-1">
      <div class="finish-sprint__header w-100">
        <Typography class-name="border-bottom text-primary fs-4 w-100">
          Завершение спринта
        </Typography>
        <Button
          @click="emit('close-modal')"
          variant="close"
        />
      </div>

      <div class="d-flex flex-column gap-2 w-100">
        <div
          class="d-flex gap-2 w-100"
          v-for="(member, index) in sprintMarks"
          :key="index"
        >
          <Input
            name="s"
            class-name="rounded w-25"
            placeholder="Оценка"
          />

          <div class="finish-sprint__member border rounded px-2 w-100">
            <div class="finish-sprint__member-name">
              {{ member.firstName }} {{ member.lastName }}
            </div>
            <div :class="getRoleProjectMemberStyle(member.projectRole)">
              {{ getRoleProjectMember().translatedRoles[member.projectRole] }}
            </div>
          </div>
        </div>
      </div>

      <div class="w-100">
        <div class="mb-2 text-primary">Отчет*</div>
        <Textarea
          name="report"
          class-name="finish-sprint__report rounded w-100"
          placeholder="Отчет"
          v-model="report"
          validate-on-update
        >
          Отчет
        </Textarea>
      </div>

      <div>
        <div class="text-primary">Перенос незавершенных задач*</div>

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
        Завершить спринт
      </Button>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.finish-sprint {
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

.modal-layout-enter-from .finish-sprint,
.modal-layout-leave-to .finish-sprint {
  transform: scale(0.9);
}
</style>
