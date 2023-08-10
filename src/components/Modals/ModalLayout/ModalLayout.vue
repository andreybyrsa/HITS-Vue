<script lang="ts" setup>
import ModalLayoutProps from '@Components/Modals/ModalLayout/ModalLayout.types'

defineProps<ModalLayoutProps>()
</script>

<template>
  <Teleport to="#modals">
    <Transition name="modal-layout">
      <div
        v-if="isOpened"
        class="modal-layout"
      >
        <slot></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.modal-layout {
  @include position(absolute, 0, 0, 0, 0, 10);

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
