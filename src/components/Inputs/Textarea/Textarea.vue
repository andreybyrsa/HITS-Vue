<script lang="ts" setup>
import { computed } from 'vue'
import { useField } from 'vee-validate'

import {
  TextareaProps,
  TextareaEmits,
} from '@Components/Inputs/Textarea/Textarea.types'

import HTMLTargetEvent from '@Domain/HTMLTargetEvent'

import Icon from '@Components/Icon/Icon.vue'

const props = defineProps<TextareaProps>()

const emit = defineEmits<TextareaEmits>()

defineModel<string>({
  required: false,
})

const { value, errorMessage, meta } = useField<string>(
  props.name,
  props.validation?.name,
  {
    validateOnValueUpdate: props.validateOnUpdate ?? false,
    validateOnMount: false,
    syncVModel: true,
  },
)

const TextareaClassName = computed(() => [
  'form-control',
  { 'is-invalid': meta.touched && (props.error || errorMessage.value) },
  props.className,
])
const LabelClassName = computed(() => [
  'form-label text-primary',
  props.labelClassName,
])
</script>

<template>
  <div class="d-flex flex-column w-100 h-100">
    <label
      :class="LabelClassName"
      v-if="label"
    >
      {{ label }}
      <Icon
        class-name="bi bi-patch-question"
        v-if="hint"
        class="hint"
        v-tooltip="hint"
      ></Icon>
    </label>

    <div class="input-group h-100">
      <span
        v-if="prepend || $slots.prepend"
        class="input-group-text fs-6"
      >
        {{ prepend }}
        <slot name="prepend"></slot>
      </span>

      <textarea
        :class="TextareaClassName"
        :name="name"
        v-model="value"
        @change="(event) => emit('change', event as HTMLTargetEvent)"
        @focus="emit('focus')"
        @blur="emit('blur')"
        :placeholder="placeholder"
        :disabled="disabled"
      ></textarea>
      <span class="invalid-feedback">
        {{ meta.touched && (error || errorMessage) }}
      </span>

      <span
        v-if="append || $slots.append"
        class="input-group-text fs-6"
      >
        {{ append }}
        <slot name="append"></slot>
      </span>
    </div>
  </div>
</template>
