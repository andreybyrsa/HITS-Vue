<template>
  <div
    :class="[
      IdeaClassName,
      'idea w-100 px-3 py-4 text-center border rounded-4',
      className,
    ]"
  >
    <Typography class="ideaname text-primary text-center">название</Typography>
    <div class="ideadates">
      <Typography class="">время</Typography>
      <Typography class="">дата</Typography>
    </div>
    <Typography class="">статус</Typography>
    <Typography class="">рейтинг</Typography>
    <Typography class="">риск</Typography>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Typography from '@Components/Typography/TypographyComp.vue'
const props = defineProps({
  className: String,
  idea: Object,
  ideaUrl: String,
  isLoading: Boolean,
})
const IdeaClassName = computed(() => {
  return [
    'idea',
    'w-100',
    'px-3',
    'py-4',
    'text-center',
    'border',
    'rounded-4',
    props.className,
  ].join(' ')
})
/*
const getRatingColor = (rating) => {
  if (rating >= 4.0) {
    return 'text-success'
  }
  if (rating < 4.0 && rating >= 3.0) {
    return 'text-warning'
  }
  return 'text-danger'
}

const getRiskColor = (risk) => {
  if (risk <= 0.2) {
    return 'text-success'
  }
  if (risk > 0.2 && risk <= 0.4) {
    return 'text-warning'
  }
  if (risk > 0.4 && risk <= 0.6) {
    return 'text-secondary'
  }
  return 'text-danger'
}

const getCurrentDate = (date) => {
  // Implement getCurrentDate function
}*/
</script>

<style lang="scss">
.idea {
  @include gridable(
    2fr 1fr 1fr 100px 100px 100px,
    $gap: 16px,
    $align-items: center
  );
}
</style>
