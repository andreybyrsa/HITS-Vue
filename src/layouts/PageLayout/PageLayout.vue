<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import { PageLayoutProps } from '@Layouts/PageLayout/PageLayout.types'

const props = defineProps<PageLayoutProps>()

const slots = useSlots()

const PageLayoutClassName = computed(() => ['page-layout', props.className])
const PageLayoutContentClassName = computed(() => [
  'page-layout__content',
  { 'page-layout__content--with-header': slots.header },
  { 'page-layout__content--no-header': !slots.header },
  props.contentClassName,
])
const PageLayoutContentWrapperClassName = computed(() => [
  'page-layout__content-wrapper',
  'w-100',
  'overflow-y-scroll',
  props.contentWrapperClassName,
])
</script>

<template>
  <div :class="PageLayoutClassName">
    <div
      v-if="$slots.leftSideBar"
      class="page-layout__leftsidebar bg-white border-end"
    >
      <slot name="leftSideBar"></slot>
    </div>

    <div :class="PageLayoutContentWrapperClassName">
      <div
        v-if="$slots.header"
        class="page-layout__header bg-white border-bottom w-100"
      >
        <slot name="header"></slot>
      </div>

      <div :class="PageLayoutContentClassName">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.page-layout {
  @include flexible(flex-start, flex-start);

  &__leftsidebar {
    height: 100vh;

    @include fixedWidth(85px);
  }

  &__header {
    @include position(sticky, $top: 0, $right: 0, $left: 0, $z-index: 6);

    height: min-content;
  }

  &__content {
    &--with-header {
      height: auto;
    }
    &--no-header {
      height: 100vh;
    }

    &-wrapper {
      height: 100vh;

      display: grid;
      grid-template-rows: min-content auto;
    }
  }
}
</style>
