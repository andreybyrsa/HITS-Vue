<script lang="ts" setup>
import { ProjectProps } from '@Views/Project/Project.types'

import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import ProjectMembersTable from '@Components/Tables/ProjectMembersTable/ProjectMembersTable.vue'
import ProjectInfo from '@Views/Project/ProjectInfo.vue'

defineProps<ProjectProps>()
</script>

<template>
  <div class="d-flex gap-3 mt-4">
    <div class="w-75">
      <ul class="list-group rounded-3">
        <li class="list-group-item p-0 overflow-hidden">
          <Button
            variant="light"
            class-name="collapse-controller w-100"
            v-collapse:openOnMount="project.id"
          >
            Описание необходимых ресурсов для реализации
          </Button>
          <Collapse :id="project.id">
            <div class="p-2">{{ project.description }}</div>
          </Collapse>
        </li>
      </ul>

      <ProjectMembersTable :projectMembers="project.members" />
    </div>

    <ProjectInfo :project="project" />
  </div>
</template>

<style lang="scss" scoped>
.collapse-controller {
  border-radius: 0;
  background-color: $white-color;

  color: $primary-color;

  @include flexible(center, flex-start);
}
</style>
