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
</script>

<template>
  <div
    class="input-group"
    v-if="props.type != 'checkbox' && props.type != 'radio'"
  >
    <span
      v-if="prepend || $slots.prepend"
      class="input-group-text fs-5"
    >
      {{ prepend }}
      <slot name="prepend"></slot>
    </span>

    <input
      v-if="props.type != 'file'"
      name="name"
      :class="InputClassName"
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @input="emit('update:value', ($event.target as HTMLInputElement).value)"
    />
    <input
      v-if="props.type == 'file'"
      name="name"
      :class="InputClassName"
      :type="props.type"
      :placeholder="props.placeholder"
      @change="emit('change')"
    />

    <span
      v-if="append || $slots.append"
      class="input-group-text"
    >
      {{ append }}
      <slot name="append"></slot>
    </span>
  </div>
</template>
