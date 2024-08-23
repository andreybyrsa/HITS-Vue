<script lang="ts" setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { TestResultProps } from '@Components/Modals/TestModal/TestModal.type'
import Typography from '@Components/Typography/Typography.vue'

const props = defineProps<TestResultProps>()

const formattedResult = computed(() => {
  return props.testResult.testResult.replace(/\n/g, '<br>')
})
</script>
<template>
  <div class="test-data p-3 w-100 bg-white rounded">
    <Typography class-name="rounded fs-5 text-primary"> Ваш результат: </Typography>
    <p v-html="formattedResult"></p>
  </div>
</template>
<style lang="scss" scoped>
.test-data {
  @include flexible(flex-start, flex-start, column, $gap: 16px);
}
</style>
