<script lang="ts" setup>
import FormLayoutProps from '@Layouts/FormLayout/FormLayout.types'
import { computed } from 'vue'

const props = defineProps<FormLayoutProps>()

const FormLayoutClassName = computed(() => [
  'form-layout p-3 rounded-3 shadow',
  props.className,
])
</script>

<template>
  <div :class="FormLayoutClassName">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.form-layout {
  width: 400px;
  background-color: $white-color;

  @include flexible(center, flex-start, column, $gap: 16px);
}
</style>
