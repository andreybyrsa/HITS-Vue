<script lang="ts" setup>
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import {
  ProjectExprienceModalProps,
  RequestToIdeaModalEmits,
} from '@Components/Modals/ProjectExperienceModal/ProjectExperienceModal.types'

import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import TeamProjectsTable from '@Components/Tables/ProfileExperienceTable/TeamProjectsTable.vue'

defineProps<ProjectExprienceModalProps>()

const emit = defineEmits<RequestToIdeaModalEmits>()
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="project-exprience-modal p-3 rounded bg-white">
      <div class="project-exprience-modal__header w-100">
        <div class="fs-5 border-bottom w-100">
          <Typography class-name="fs-5 text-primary">
            История проектов с командой "{{ teamName }}"
          </Typography>
        </div>
        <Button
          variant="close"
          @click="emit('close-modal')"
        />
      </div>

      <TeamProjectsTable
        v-if="teamProject.length"
        :projects="teamProject"
      />

      <Typography
        v-else
        class-name="text-secondary fs-6 w-100 text-center"
      >
        С этой командой у вас не было проектов
      </Typography>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.img {
  width: 200px;
}
.project-exprience-modal {
  width: 800px;
  max-height: 400px;
  overflow-y: scroll;

  @include flexible(
    stretch,
    stretch,
    column,
    $align-self: center,
    $justify-self: center,
    $gap: 12px
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }
}

.modal-layout-enter-from .project-exprience-modal,
.modal-layout-leave-to .project-exprience-modal {
  transform: scale(0.9);
}
</style>
