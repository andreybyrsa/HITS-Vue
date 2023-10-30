<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'

const isStatementContent = defineModel<boolean>()

function changeOnYourself() {
  isStatementContent.value = true
}
function changeOnTeam() {
  isStatementContent.value = false
}
</script>

<template>
  <div class="d-flex justify-content-center w-100">
    <Button
      class-name="btn-link fs-5"
      @click="changeOnYourself"
      :disabled="isStatementContent"
    >
      Заявить себя
    </Button>
    <Button
      class-name="btn-link fs-5"
      @click="changeOnTeam"
      :disabled="!isStatementContent"
    >
      Заявить команду
    </Button>
  </div>
</template>

<style lang="scss" scoped></style>
