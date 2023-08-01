<script lang="ts" setup>
defineProps({
  leftSideBar: Boolean,
})
</script>

<template>
  <div class="page-layout vw-100">
    <div
      v-if="leftSideBar"
      class="page-layout__leftsidebar"
    >
      <slot name="leftSideBar" />
    </div>
    <div class="page-layout__content">
      <slot name="content" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-layout {
  @include flexible(flex-start, flex-start);

  &__leftsidebar {
    @include position(sticky, $left: 0, $top: 0, $bottom: 0);
    @include border(solid, #d8d8d8, 0, 1px);

    min-width: 320px;
    height: 100vh;
  }

  &__content {
    @include flexible(center, center);
    width: 100%;
    height: 100vh;
  }
}
</style>
