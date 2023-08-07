<script lang="ts" setup>
import ModalLayoutProps from '@Components/Modals/ModalLayout/ModalLayout.types'

defineProps<ModalLayoutProps>()
</script>

<template>
  <Teleport to="#modals">
    <div
      v-if="isOpened"
      class="modal-layout"
    >
      <slot></slot>
    </div>
  </Teleport>
</template>

<style lang="scss">
.modal-layout {
  @include position(absolute, 0, 0, 0, 0, 1);

  background-color: $background-color--blured;

  display: grid;
}
</style>
