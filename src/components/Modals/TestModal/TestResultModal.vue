<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { TestResultProps } from '@Components/Modals/TestModal/TestModal.type'
import Typography from '@Components/Typography/Typography.vue'

const props = defineProps<TestResultProps>()
</script>
<template>
  <div class="test-data p-3 w-100 bg-white rounded">
    <Typography class-name="rounded fs-5 text-primary"> Ваш результат: </Typography>
    <Typography> {{ testResult.result }} </Typography>
  </div>
</template>
<style lang="scss" scoped>
.test-data {
  @include flexible(flex-start, flex-start, column, $gap: 16px);
}
</style>
