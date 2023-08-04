<script lang="ts" setup>
import { computed } from 'vue'
import { InputProps, InputEmits } from '@Components/Input/Input.types'

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
})

const emit = defineEmits<InputEmits>()

const InputClassName = computed(() => [
  'form-control form-control-lg',
  props.className,
])
const LabelClassName = computed(() => ['form-label', props.className])
</script>

<template>
  <labeL
    for="name"
    :class="LabelClassName"
    v-if="label"
  >
    {{ label }}
  </labeL>
  <div class="input-group">
    <span
      v-if="prepend"
      class="input-group-text"
    >
      <i
        class="fs-5"
        :class="prepend"
      ></i>
    </span>

    <input
      name="name"
      :class="InputClassName"
      :type="props.type"
      :placeholder="props.placeholder"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />

    <span
      v-if="append"
      class="input-group-text"
    >
      {{ append }}
    </span>
  </div>
</template>

<style>
.icon {
  font-size: 23px;
}
</style>
