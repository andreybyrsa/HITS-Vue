<script lang="ts" setup generic="DataType">
import SendDataModalProps from '@Components/Modals/SendDataModal/SendDataModal.types'

import Button from '@Components/Button/Button.vue'

defineProps<SendDataModalProps<DataType>>()

// function checkIdeaCONFIRMED(data: DataType[]) {
//   if (data.length) {
//     if (data.find((elem) => elem.status != 'CONFIRMED')) {
//       return false
//     } else return true
//   }
// }
</script>

<template>
  <div
    v-if="data.length"
    class="table-modal p-3 rounded-3 bg-white shadow"
  >
    <template
      v-for="(button, index) in buttons"
      :key="index"
    >
      <Button
        v-if="button.statement"
        @click="button.click(data)"
        class="btn-outline-primary"
      >
        {{ button.label }}
      </Button>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.table-modal {
  position: absolute;
  top: 0;
  left: auto;

  width: 90%;

  @include flexible(row, $gap: 16px, $align-self: stretch, $justify-self: flex-end);

  animation: start 0.3s ease-out;
}

@keyframes start {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(0%);
  }
}
</style>
