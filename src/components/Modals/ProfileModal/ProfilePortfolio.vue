<script lang="ts" setup>
import Typography from '@Components/Typography/Typography.vue'
import TeamExperienceTable from '@Components/Tables/TeamsTable/TeamExperienceTable.vue'
</script>

<template>
  <div class="profile-ideas w-100 bg-white border p-3 rounded-3">
    <div class="profile-ideas__header border-bottom mb-2">
      <Typography class-name="fs-5 text-primary">Портфолио</Typography>
    </div>

    <TeamExperienceTable />
  </div>
</template>

<style lang="scss" scoped>
.profile-ideas {
  &__header {
    @include flexible(center, space-between);
  }
}
</style>
