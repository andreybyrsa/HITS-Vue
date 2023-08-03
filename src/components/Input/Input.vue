<script lang="ts" setup>
import { computed } from 'vue'
import { InputProps, InputEmits } from './Input.types'

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
})

const emit = defineEmits<InputEmits>()

const InputClassName = computed(() => ['form-control', props.className])
</script>

<template>
  <input
    :class="InputClassName"
    :type="props.type"
    :placeholder="props.placeholder"
    @input="
      emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
  />
</template>

<style></style>
