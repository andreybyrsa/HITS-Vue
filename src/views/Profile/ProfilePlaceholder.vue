<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import IdeaCommentsPlaceholder from '@Components/Modals/IdeaModal/IdeaCommentsPlaceholder.vue'
</script>

<template>
  <div class="profile-placeholder p-3 w-100 overflow-y-scroll">
    <div class="w-100">
      <LoadingPlaceholder />
    </div>
    <div class="profile-placeholder__container">
      <div class="profile-placeholder__left-side bg-white rounded p-2">
        <div class="w-50">
          <LoadingPlaceholder />
        </div>

        <div class="w-100 d-flex justify-content-center">
          <div class="w-50">
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
          <div class="profile-placeholder__right-side_header border-bottom">
            <div
              class="w-25 m-2"
              v-for="value in 2"
              :key="value"
            >
              <LoadingPlaceholder />
            </div>
          </div>

          <div class="profile-placeholder__right-side_content p-2">
            <div
              class="w-50"
              v-for="value in 4"
              :key="value"
            >
              <div class="w-25">
                <LoadingPlaceholder />
              </div>
              <div class="w-50">
                <LoadingPlaceholder />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded p-3">
          <div class="profile-placeholder__right-side_header border-bottom">
            <div
              class="w-25 m-2"
              v-for="value in 2"
              :key="value"
            >
              <LoadingPlaceholder />
            </div>
          </div>

          <div class="profile-placeholder__right-side_content p-2">
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
          class="bg-white rounded p-3"
          v-for="value in 2"
          :key="value"
        >
          <div class="profile-placeholder__right-side_header border-bottom">
            <div
              class="w-25 m-2"
              v-for="value in 1"
              :key="value"
            >
              <LoadingPlaceholder />
            </div>
          </div>

          <div class="profile-placeholder__right-side_content p-2">
            <div
              class="w-100"
              v-for="value in 3"
              :key="value"
            >
              <div class="w-100">
                <LoadingPlaceholder height="medium" />
              </div>
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

    &_header {
      width: 100%;
      @include flexible(stretch, space-between);
    }

    &_content {
      width: 100%;
      @include flexible(stretch, flex-start, column, $gap: 16px);
    }
  }
}
</style>
