<script lang="ts" setup>
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import CompanyPlaceholder from '@Components/Forms/CompanyForm/CompanyPlaceholder.vue'
</script>

<template>
  <div class="company-form-placeholder bg-white p-3">
    <div class="company-form-placeholder__content w-75 h-100">
      <div class="w-25">
        <LoadingPlaceholder />
      </div>

      <LoadingPlaceholder
        v-for="index in 2"
        :key="index"
        height="small"
      />

      <div class="w-100 d-flex gap-3">
        <LoadingPlaceholder
          v-for="index in 2"
          :key="index"
          height="medium"
        />
      </div>

      <CompanyPlaceholder />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.company-form-placeholder {
  @include flexible(flex-start, center);

  &__content {
    @include flexible(center, flex-start, column, $gap: 16px);
  }

  &__member {
    width: 100px;
  }
}
</style>
