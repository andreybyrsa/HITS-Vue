<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import Typography from '@Components/Typography/Typography.vue'
import TeamsExperienceTable from '@Components/Tables/ProfileExperienceTable/TeamsExperinceTable.vue'

import useProfilesStore from '@Store/profiles/profilesStore'

const route = useRoute()
const profilesStore = useProfilesStore()

const profileId = route.params.id.toString()
const profile = computed(() => profilesStore.getProfileByUserId(profileId))
</script>

<template>
  <div class="w-100 bg-white border p-3 rounded-3">
    <div class="fs-5 border-bottom">
      <Typography class-name="fs-5 text-primary">Портфолио</Typography>
    </div>
    <TeamsExperienceTable
      v-if="profile"
      :profile="profile"
    />
  </div>
</template>

<style lang="scss" scoped></style>
