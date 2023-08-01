<script lang="ts" setup>
import InputProps from '@Components/Input/InputComp.types'
const props = defineProps<InputProps>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()
</script>

<template>
  <input
    :type="props.inputType"
    :placeholder="props.inputPlaceholder"
    @input="
      emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
    :class="props.inputStyle"
  />
</template>

<style></style>
