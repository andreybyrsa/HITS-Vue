<script lang="ts" setup>
import { ref, VueElement } from 'vue'
import { useEventListener } from '@vueuse/core'

import {
  ModalLayoutProps,
  ModalLayoutEmits,
} from '@Components/Modals/ModalLayout/ModalLayout.types'

import HTMLTargetEvent from '@Domain/HTMLTargetEvent'

defineProps<ModalLayoutProps>()

const emit = defineEmits<ModalLayoutEmits>()

const modalLayoutRef = ref<VueElement>()

useEventListener(modalLayoutRef, 'click', (event: HTMLTargetEvent) => {
  const modalLayoutClassName = event.target.className

  if (modalLayoutClassName === 'modal-layout' && emit('on-outside-close')) {
    emit('on-outside-close')
  }
})
</script>

<template>
  <Teleport to="#modals">
    <Transition name="modal-layout">
      <div
        v-if="isOpened"
        ref="modalLayoutRef"
        class="modal-layout"
      >
        <slot></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.modal-layout {
  @include position(fixed, 0, 0, 0, 0, 10);

  background-color: $background-color--blured;

  display: grid;

  transition: opacity $default-transition-settings;
}

.modal-layout-enter-from {
  opacity: 0;
}

.modal-layout-leave-to {
  opacity: 0;
}
</style>
