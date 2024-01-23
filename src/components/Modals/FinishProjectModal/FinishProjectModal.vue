<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
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

const props = defineProps<FinishProjectModalProps>()

const emit = defineEmits<FinishProjectModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const averageMark = ref<AverageMark[]>([])

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
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="finish-project-modal bg-white rounded p-3">
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
      <div class="d-flex w-100 gap-2 flex-column">
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
          <div class="w-25 h-100">
            <Input
              :name="member.projectId"
              class-name="rounded finish-project-modal__input"
              placeholder="Оценка"
              v-model="member.mark"
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
                <div class="fp-2 m-2">
                  <div class="text-primary">Выполненные задачи*</div>

                  <div
                    class="justify-content-between d-flex rounded-3 border p-2 mb-1"
                  >
                    <div>Cделать перевод идей</div>
                    <div class="d-flex gap-1">
                      <Icon class="bi bi-circle-fill text-warning"> </Icon>Бэкенд
                    </div>
                  </div>
                  <div
                    class="justify-content-between d-flex rounded-3 border p-2 mb-1"
                  >
                    <div>Cделать перевод идей</div>
                    <div class="d-flex gap-1">
                      <Icon class="bi bi-circle-fill text-info"> </Icon>Проектировка
                    </div>
                  </div>
                  <div
                    class="justify-content-between d-flex rounded-3 border p-2 mb-1"
                  >
                    <div>Cделать перевод идей</div>
                    <div class="d-flex gap-1">
                      <Icon class="bi bi-circle-fill text-success"> </Icon>Рефактор
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
      </div>

      <div class="w-100">
        <div class="mb-2 text-primary">Отчет*</div>
        <Textarea
          name="report"
          class-name="finish-project-modal__report rounded w-100"
          placeholder="Отчет"
        >
          Отчет
        </Textarea>
      </div>

      <Checkbox
        class-name="text-primary"
        name="newSprint"
        v-if="status === 'SPRINT'"
        label="Перенести в новый спринт*"
      >
      </Checkbox>
      <Button
        v-if="status === 'PROJECT'"
        @click="emit('close-modal')"
        variant="primary"
      >
        Закрыть проект
      </Button>

      <Button
        v-else
        @click="emit('close-modal')"
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
