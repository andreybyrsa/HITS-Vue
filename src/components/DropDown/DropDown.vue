<script lang="ts" setup>
import { computed } from 'vue'

import DropDownProps from '@Components/DropDown/DropDown.types'

const props = defineProps<DropDownProps>()

const DropDownClassName = computed(() => ['dropdown-menu p-2', props.className])
</script>

<template>
  <ul :class="DropDownClassName">
    <slot></slot>
  </ul>
</template>
