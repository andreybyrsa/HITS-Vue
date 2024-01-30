<script lang="ts" setup>
import Placeholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
</script>
<template>
  <div class="d-flex flex-column gap-3 p-3">
    <div class="border rounded">
      <div class="p-3">
        <Placeholder class-name="small"></Placeholder>
      </div>
      <div class="w-25 d-flex p-3 gap-2">
        <Placeholder class-name=""></Placeholder
        ><Placeholder class-name=""></Placeholder
        ><Placeholder class-name=""></Placeholder
        ><Placeholder class-name=""></Placeholder>
      </div>
    </div>
    <div class="d-flex w-100">
      <div class="w-100 h-100">
        <div class="border rounded w-100 p-3 h-100 mb-3">
          <Placeholder class-name="small"></Placeholder>
        </div>
        <div class="border rounded w-25 p-3 mb-3">
          <div class=""><Placeholder class-name=""></Placeholder></div>
        </div>
        <div class="border rounded w-100 p-3">
          <div class="gap-5 d-flex justify-content-space-between w-100 pb-3">
            <Placeholder class-name=""></Placeholder
            ><Placeholder class-name=""></Placeholder
            ><Placeholder class-name=""></Placeholder
            ><Placeholder class-name=""></Placeholder>
          </div>
          <div class="gap-5 d-flex w-100 pb-3">
            <Placeholder class-name=""></Placeholder
            ><Placeholder class-name=""></Placeholder
            ><Placeholder class-name=""></Placeholder
            ><Placeholder class-name=""></Placeholder>
          </div>
          <div class="gap-5 d-flex w-100 pb-3">
            <Placeholder class-name=""></Placeholder
            ><Placeholder class-name=""></Placeholder
            ><Placeholder class-name=""></Placeholder
            ><Placeholder class-name=""></Placeholder>
          </div>
          <div class="gap-5 d-flex w-100 pb-3">
            <Placeholder class-name=""></Placeholder
            ><Placeholder class-name=""></Placeholder
            ><Placeholder class-name=""></Placeholder
            ><Placeholder class-name=""></Placeholder>
          </div>
        </div>
      </div>
      <div class="border rounded ms-3">
        <div
          class="content__info bg-primary rounded-top border border-bottom-0"
        ></div>
        <div class="bg-white rounded-bottom p-3 border border-top-0">
          <div class="w-50">
            <Placeholder></Placeholder>
          </div>
          <div class="w-75"><Placeholder></Placeholder></div>
          <div class="w-50 pt-3">
            <Placeholder></Placeholder>
          </div>
          <div class="w-75"><Placeholder></Placeholder></div>
          <div class="w-50 pt-3">
            <Placeholder></Placeholder>
          </div>
          <div class="w-75"><Placeholder></Placeholder></div>
          <div class="w-50 pt-3">
            <Placeholder></Placeholder>
          </div>
          <div class="w-75"><Placeholder></Placeholder></div>
          <div class="w-100 p-3">
            <Placeholder></Placeholder><Placeholder></Placeholder>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.content {
  &__info {
    width: 325px;
    height: 60px;
    @include flexible(center, center);
  }
}
</style>
