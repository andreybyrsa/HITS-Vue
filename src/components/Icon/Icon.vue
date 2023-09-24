<script lang="ts" setup>
import { IconEmits, IconProps } from '@Components/Icon/Icon.types'

defineProps<IconProps>()

const emit = defineEmits<IconEmits>()
</script>

<template>
  <i
    :class="className"
    @click="emit('click')"
  ></i>
</template>
