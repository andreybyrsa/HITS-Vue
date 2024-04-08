<script lang="ts" setup>
import { ProjectProps } from '@Views/Project/Project.types'

import { getProjectStatus, getProjectStatusStyle } from '@Utils/getProjectStatus'

import Typography from '@Components/Typography/Typography.vue'

defineProps<ProjectProps>()
</script>

<template>
  <div class="d-flex gap-3 align-items-center mb-2">
    <Typography class-name="fs-4 text-primary">{{ project.name }}</Typography>
    <div :class="getProjectStatusStyle(project.status)">
      {{ getProjectStatus().translatedStatus[project.status] }}
    </div>
  </div>
</template>

<style lasg="scss" scoped></style>
