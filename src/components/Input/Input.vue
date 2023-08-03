<script lang="ts" setup>
import { computed } from 'vue'
import { InputProps, InputEmits } from '@Components/Input/Input.types'

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
})

const emit = defineEmits<InputEmits>()

const InputClassName = computed(() => ['form-control', props.className])
const LabelClassName = computed(() => ['form-label', props.className])
</script>

<template>
  <labeL
    for="name"
    :class="LabelClassName"
    v-if="label != null"
  >
    {{ label }}
  </labeL>
  <div class="input-group">
    <div
      class="input-group-prepend"
      v-if="prepend != null"
    >
      <span class="input-group-text">{{ prepend }}</span>
    </div>
    <input
      name="name"
      :class="InputClassName"
      :type="props.type"
      :placeholder="props.placeholder"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <div
      class="input-group-append"
      v-if="append != null"
    >
      <span class="input-group-text">{{ append }}</span>
    </div>
  </div>
</template>
