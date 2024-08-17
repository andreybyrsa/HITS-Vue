<script lang="ts" setup>
import { TestHeaderEmits } from '@Components/Modals/TestModal/TestModal.type'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'

const emit = defineEmits<TestHeaderEmits>()
</script>

<template>
  <div class="test-header">
    <Button
      variant="primary"
      prepend-icon-name="bi bi-backspace-fill"
      @click="emit('close-modal')"
    >
      Назад
    </Button>

    <Typography class-name="p-2 w-100 bg-white rounded fs-4 text-primary">
      Информация о тесте
    </Typography>
  </div>
</template>

<style lang="scss" scoped>
.test-header {
  @include flexible(stretch, flex-start, $gap: 16px);
}
</style>
