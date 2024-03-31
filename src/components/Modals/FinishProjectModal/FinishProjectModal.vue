<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'

import Typography from '@Components/Typography/Typography.vue'

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
import useProjectsStore from '@Store/projects/projectsStore'
import Validation from '@Utils/Validation'
import {
  RequestConfig,
  openErrorNotification,
  sendParallelRequests,
} from '@Utils/sendParallelRequests'

const isLoading = ref(false)
const refValue = ref()
const report = ref('')

defineProps<FinishProjectModalProps>()

const emit = defineEmits<FinishProjectModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const averageMark = ref<AverageMark[]>([])

const projectStore = useProjectsStore()

onMounted(async () => {
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
})

const validationSchemaProject = {
  report: (value: string) =>
    Validation.checkIsEmptyValue(value) || 'Это обязательное поле',
}

const { handleSubmit } = useForm({
  validationSchema: validationSchemaProject,
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
    <div class="finish-project bg-white rounded p-3 w-1">
      <div class="finish-project__header w-100">
        <Typography class-name="border-bottom text-primary fs-4 w-100">
          Завершение проекта
        </Typography>
        <Button
          @click="emit('close-modal')"
          variant="close"
        />
      </div>

      <div class="d-flex flex-column gap-2 w-100">
        <div
          class="d-flex gap-2 w-100"
          v-for="(member, index) in averageMark"
          :key="index"
        >
          <div
            class="p-2 bg-primary text-white rounded"
            v-tooltip="'Средняя оценка за проект'"
          >
            {{ member.mark }}
          </div>

          <div class="finish-project__member border rounded px-2 w-100">
            <div class="finish-project__member-name">
              {{ member.firstName }} {{ member.lastName }}
            </div>
            <div :class="getRoleProjectMemberStyle(member.projectRole)">
              {{ getRoleProjectMember().translatedRoles[member.projectRole] }}
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="d-flex flex-column gap-2 w-100">
        <div class="d-flex gap-3 text-primary w-100">
          <Typography class-name="w-25">Средняя оценка</Typography>
          <Typography class-name="w-75">Участник</Typography>
        </div>
        <div
          class="d-flex gap-3 w-100 justify-content-between"
          v-for="(member, index) in averageMark"
          :key="index"
        >
          <div class="w-25">
            <Input
              :name="member.userId"
              class-name="rounded"
              placeholder="Оценка"
              v-model="member.mark"
              disabled
            />
          </div>

          <div class="finish-project__member border rounded px-2 w-75">
            <div>{{ member.firstName }} {{ member.lastName }}</div>
            <div :class="getRoleProjectMemberStyle(member.projectRole)">
              {{ getRoleProjectMember().translatedRoles[member.projectRole] }}
            </div>
          </div>
        </div>
      </div> -->

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

      <Button
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
