<script lang="ts" setup>
import { computed } from 'vue'

import DropDownProps from './DropDown.types'

const props = defineProps<DropDownProps>()

const DropDownClassName = computed(() => ['collapse', props.className])
</script>

<template>
  <div
    :id="id"
    :class="DropDownClassName"
  >
    <div class="list-group p-2">
      <slot></slot>
    </div>
  </div>
</template>
