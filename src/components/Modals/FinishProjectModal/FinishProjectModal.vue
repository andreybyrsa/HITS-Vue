<script lang="ts" setup>
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'

import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'

import {
  getRoleProjectMember,
  getRoleProjectMemberStyle,
} from '@Utils/getRoleProjectMember'

import {
  FinishProjectModalEmits,
  FinishProjectModalProps,
  membersType,
} from '@Components/Modals/FinishProjectModal/FinishProjectModal.types'

defineProps<FinishProjectModalProps>()

const emit = defineEmits<FinishProjectModalEmits>()

const members: membersType[] = [
  {
    score: '9.3',
    name: 'Артем Иванов',
    role: 'TEAM_LEADER',
  },
  {
    score: '7.5',
    name: 'Артем Иванов',
    role: 'MEMBER',
  },
  {
    score: '6.8',
    name: 'Артем Иванов',
    role: 'MEMBER',
  },
  {
    score: '8.1',
    name: 'Артем Иванов',
    role: 'MEMBER',
  },
  {
    score: '8.0',
    name: 'Артем Иванов',
    role: 'MEMBER',
  },
  {
    score: '7.9',
    name: 'Артем Иванов',
    role: 'MEMBER',
  },
]
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="finish-project-modal bg-white rounded p-3">
      <div class="finish-project-modal__header fs-2 w-100 border-2">
        <Typography class-name="border-bottom text-primary fs-3 w-100">
          Завершение проекта
        </Typography>
        <Button
          @click="emit('close-modal')"
          class-name="fs-5"
          variant="close"
        />
      </div>

      <div class="d-flex w-100 gap-2 flex-column">
        <div class="d-flex gap-3 text-primary w-100">
          <Typography class-name="w-25">Средняя оценка</Typography>
          <Typography class-name="w-75">Участник</Typography>
        </div>
        <div
          class="d-flex gap-3 w-100"
          v-for="(member, index) in members"
          :key="index"
        >
          <div class="w-25">
            <Input
              :name="member.name"
              class-name="rounded"
              placeholder="Оценка"
              v-model="member.score"
            />
          </div>

          <div class="finish-project-modal__member rounded border px-2 w-75">
            {{ member.name }}
            <div :class="getRoleProjectMemberStyle(member.role)">
              {{ getRoleProjectMember().translatedRoles[member.role] }}
            </div>
          </div>
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

      <Button
        @click="emit('close-modal')"
        variant="primary"
      >
        Закрыть проект
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
  }

  &__report {
    resize: none;
    height: 200px;
  }
}

.modal-layout-enter-from .finish-project-modal,
.modal-layout-leave-to .finish-project-modal {
  transform: scale(0.9);
}
</style>
