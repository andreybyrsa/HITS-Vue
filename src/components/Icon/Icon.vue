<script lang="ts" setup>
import { computed } from 'vue'

import { IconEmits, IconProps } from '@Components/Icon/Icon.types'

const props = defineProps<IconProps>()

const emit = defineEmits<IconEmits>()

const IconClassName = computed(() => ['icon', props.className])
</script>

<template>
  <i
    :class="IconClassName"
    @click="emit('click')"
  ></i>
</template>
