<script lang="ts" setup>
import { computed } from 'vue'
import PageLayoutProps from '@Layouts/PageLayout/PageLayout.types'

const props = defineProps<PageLayoutProps>()

const PageLayoutClassName = computed(() => ['page-layout', props.className])
const PageLayoutContentClassName = computed(() => [
  'page-layout__content',
  props.contentClassName,
])
</script>

<template>
  <div :class="PageLayoutClassName">
    <div
      v-if="$slots.leftSideBar"
      class="page-layout__leftsidebar"
    >
      <slot name="leftSideBar"></slot>
    </div>

    <div :class="PageLayoutContentClassName">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-layout {
  @include flexible(flex-start, flex-start);

  &__leftsidebar {
    @include position(sticky, $left: 0, $top: 0, $bottom: 0);
    @include border(solid, #d8d8d8, 0, 1px);

    @include fixedWidth(320px);
    height: 100vh;
  }

  &__content {
    width: 100%;
    height: 100vh;
  }
}
</style>
