<script lang="ts" setup>
import { computed } from 'vue'

import CollapseProps from '@Components/Collapse/Collapse.types'

const props = defineProps<CollapseProps>()

const CollapseClassName = computed(() => ['collapse', props.className])
</script>

<template>
  <div
    :id="id"
    :class="CollapseClassName"
  >
    <div class="list-group">
      <slot></slot>
    </div>
  </div>
</template>
