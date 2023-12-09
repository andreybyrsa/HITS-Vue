<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import Skills from '@Components/Skills/Skills.vue'
</script>

<template>
  <div
    v-for="value in 3"
    :key="value"
    class="col-xl-6"
  >
    <div class="idea-card">
      <div class="idea-card-left">
        <div class="w-50">
          <LoadingPlaceholder />
        </div>
        <div class="w-75">
          <LoadingPlaceholder />
        </div>
        <div class="w-25">
          <LoadingPlaceholder />
        </div>
        <div class="idea-stacks">
          <Skills />
        </div>
      </div>
      <div class="idea-card-right">
        <div class="idea-start-date w-25">
          <LoadingPlaceholder />
        </div>
        <div class="idea-start-date w-25">
          <LoadingPlaceholder />
        </div>
        <div class="idea-start-date w-25">
          <LoadingPlaceholder />
        </div>
        <div class="idea-start-date w-25">
          <LoadingPlaceholder />
        </div>
        <div class="idea-start-date w-25">
          <LoadingPlaceholder />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.idea-card {
  min-width: 100%;
  height: 100%;
  display: flex;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  .idea-card-left {
    flex: 1;
    padding-right: 20px;
  }
  .idea-card-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
  }
}
</style>
