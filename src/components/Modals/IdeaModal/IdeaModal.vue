<script lang="ts" setup>
import { ref, VueElement } from 'vue'

import {
  IdeaModalProps,
  IdeaModalEmits,
} from '@Components/Modals/IdeaModal/IdeaModal.types'
import { Idea } from '@Domain/Idea'
import IdeaDescription from '@Components/Modals/IdeaModal/IdeaDescription.vue'
import IdeaComments from '@Components/Modals/IdeaModal/IdeaComments.vue'
import IdeaActions from '@Components/Modals/IdeaModal/IdeaActions.vue'
import IdeaInfo from '@Components/Modals/IdeaModal/IdeaInfo.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

defineProps<IdeaModalProps>()

const emit = defineEmits<IdeaModalEmits>()

const ideaModalRef = ref<VueElement>()
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div
      class="idea-modal p-3 h-100 overflow-y-scroll"
      ref="ideaModalRef"
    >
      <div class="idea-modal__left-side w-75">
        <IdeaDescription
          :idea="idea"
          @close-modal="emit('close-modal')"
        />

        <IdeaActions :idea="(idea as Idea)" />

        <IdeaComments
          :idea="idea"
          :idea-modal-ref="ideaModalRef"
        />
      </div>

      <div class="idea-modal__right-side w-25 bg-white rounded">
        <IdeaInfo :idea="idea" />
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.idea-modal {
  position: relative;

  width: 80%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #e9e9e9;

  @include flexible(
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;

  &__left-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }

  &__right-side {
    height: fit-content;

    @include flexible(stretch, flex-start, column, $gap: 16px);
  }
}

.modal-layout-enter-from .idea-modal,
.modal-layout-leave-to .idea-modal {
  transform: translateX(100%);
}
</style>
