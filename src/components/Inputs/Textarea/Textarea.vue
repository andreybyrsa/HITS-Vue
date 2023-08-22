<script lang="ts" setup>
import { computed } from 'vue'
import { useField } from 'vee-validate'

import {
  TextareaProps,
  TextareaEmits,
  HTMLTextareaEvent,
} from '@Components/Inputs/Textarea/Textarea.types'

const props = defineProps<TextareaProps>()

const emit = defineEmits<TextareaEmits>()

defineModel<string>({
  required: false,
})

const { value, errorMessage } = useField(props.name, props.validation, {
  validateOnValueUpdate: !!props.validation,
  syncVModel: true,
})

const TextareaClassName = computed(() => [
  'form-control form-control-lg',
  { 'is-invalid': props.error || errorMessage.value },
  props.className,
])
const LabelClassName = computed(() => [
  'form-label text-primary',
  props.labelClassName,
])
</script>

<template>
  <div class="w-100">
    <label
      :class="LabelClassName"
      v-if="label"
    >
      {{ label }}
    </label>

    <div class="input-group">
      <span
        v-if="prepend || $slots.prepend"
        class="input-group-text fs-5"
      >
        {{ prepend }}
        <slot name="prepend"></slot>
      </span>

      <textarea
        :class="TextareaClassName"
        :name="name"
        v-model="value"
        @change="(event) => emit('change', event as HTMLTextareaEvent)"
        @focus="emit('focus')"
        @blur="emit('blur')"
        :placeholder="placeholder"
        :disabled="disabled"
      ></textarea>
      <span class="invalid-feedback">
        {{ error || errorMessage }}
      </span>

      <span
        v-if="append || $slots.append"
        class="input-group-text fs-5"
      >
        {{ append }}
        <slot name="append"></slot>
      </span>
    </div>
  </div>
</template>
