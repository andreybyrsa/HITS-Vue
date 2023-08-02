<script lang="ts" setup>
interface ButtonProps {
  className: string
  iconName?: string
}
const props = defineProps<ButtonProps>()
</script>
<template>
  <button :class="props.className">
    <i
      v-if="props.iconName"
      :class="props.iconName"
    ></i>
    <slot />
  </button>
</template>
