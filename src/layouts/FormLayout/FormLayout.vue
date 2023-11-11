<script lang="ts" setup>
import { computed } from 'vue'

import FormLayoutProps from '@Layouts/FormLayout/FormLayout.types'

const props = defineProps<FormLayoutProps>()

const FormLayoutClassName = computed(() => [
  'form-layout p-3 rounded-3 shadow',
  props.className,
])
</script>

<template>
  <form :class="FormLayoutClassName">
    <slot></slot>
  </form>
</template>

<style lang="scss">
.form-layout {
  width: 400px;
  background-color: $white-color;

  @include flexible(stretch, flex-start, column, $gap: 12px);
}
</style>
