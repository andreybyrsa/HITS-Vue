<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
</script>

<template>
  <div class="profile-placeholder w-100">
    <div class="w-75">
      <LoadingPlaceholder />
    </div>

    <div class="profile-placeholder__container">
      <div class="profile-placeholder__left-side bg-white rounded p-3">
        <div class="w-100 d-flex justify-content-center">
          <div class="profile-placeholder__avatar rounded-circle overflow-hidden">
            <LoadingPlaceholder height="second" />
          </div>
        </div>

        <div class="w-100 d-flex gap-2">
          <div
            class="w-25"
            v-for="value in 4"
            :key="value"
          >
            <LoadingPlaceholder class-name="p-3" />
          </div>
        </div>
      </div>

      <div class="profile-placeholder__right-side">
        <div class="bg-white rounded p-3">
          <div class="profile-placeholder__right-side-header border-bottom">
            <div class="w-25 mb-1">
              <LoadingPlaceholder />
            </div>
          </div>

          <div class="profile-placeholder__right-side-content">
            <div
              class="w-75"
              v-for="value in 4"
              :key="value"
            >
              <div class="w-50">
                <LoadingPlaceholder />
              </div>
              <div class="w-75">
                <LoadingPlaceholder />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded p-3">
          <div class="profile-placeholder__right-side-header border-bottom">
            <div
              class="w-25 m-2"
              v-for="value in 2"
              :key="value"
            >
              <LoadingPlaceholder />
            </div>
          </div>

          <div class="profile-placeholder__right-side-content p-2">
            <div
              class="w-50"
              v-for="value in 3"
              :key="value"
            >
              <div class="w-100">
                <LoadingPlaceholder height="medium" />
              </div>
            </div>
          </div>
        </div>

        <div
          class="d-flex flex-column gap-3 bg-white rounded-3 p-3"
          v-for="value in 2"
          :key="value"
        >
          <div class="profile-placeholder__right-side-header border-bottom">
            <div class="w-25 mb-1">
              <LoadingPlaceholder />
            </div>
          </div>

          <div
            v-for="index in 3"
            :key="index"
            class="w-100 p-2 d-flex flex-column border rounded"
          >
            <div class="w-75">
              <LoadingPlaceholder />
            </div>
            <div class="w-50">
              <LoadingPlaceholder />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-placeholder {
  @include flexible(flex-start, flex-start, column, $gap: 16px);

  &__avatar {
    @include fixedHeight(200px);
    @include fixedWidth(200px);
  }

  &__container {
    height: fit-content;
    width: 100%;
    @include flexible(start, start, $gap: 16px);
  }

  &__left-side {
    height: fit-content;
    width: 33%;
    @include flexible(flex-end, center, column, $gap: 16px);
  }

  &__right-side {
    height: fit-content;
    width: 65%;
    @include flexible(stretch, flex-start, column, $gap: 16px);

    &-header {
      width: 100%;
      @include flexible(stretch, space-between);
    }

    &-content {
      width: 100%;
      @include flexible(stretch, flex-start, column, $gap: 16px);
    }
  }
}
</style>
