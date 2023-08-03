<script lang="ts" setup>
import { computed } from 'vue'
import Typography from '@Components/Typography/Typography.vue'
import IdeaProps from './Idea.types'

const props = defineProps<IdeaProps>()

const IdeaClassName = computed(() => {
  return ['idea w-100 px-3 py-4 text-center border rounded-4', props.className]
})
const getRatingColor = (rating: number) => {
  if (rating >= 4.0) {
    return 'text-success'
  }
  if (rating < 4.0 && rating >= 3.0) {
    return 'text-warning'
  }
  return 'text-danger'
}

const getRiskColor = (risk: number) => {
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
</script>

<template>
  <div :class="IdeaClassName">
    <Typography class-name="ideaname text-primary text-center">{{
      props.idea.name
    }}</Typography>
    <div class="idea__dates">
      <Typography>{{ props.idea.dateCreated }}</Typography>
      <Typography>{{ props.idea.dateUpdated }}</Typography>
    </div>
    <Typography>{{ props.idea.status }}</Typography>
    <Typography :class-name="getRatingColor(props.idea.rating)">{{
      props.idea.rating
    }}</Typography>
    <Typography :class-name="getRiskColor(props.idea.risk)">{{
      props.idea.risk
    }}</Typography>
  </div>
</template>

<style lang="scss">
.idea {
  @include gridable(
    2fr 1fr 1fr 100px 100px 100px,
    $gap: 16px,
    $align-items: center
  );
}
</style>
