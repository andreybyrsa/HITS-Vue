<script lang="ts" setup>
import ProfileProjectsProps from '@Views/Profile/Projects.types'

import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Collapse from '@Components/Collapse/Collapse.vue'

const props = defineProps<ProfileProjectsProps>()
</script>

<template>
  <div class="w-100 bg-white border p-3 rounded-4">
    <div class="header border-bottom pb-1">
      <Typography class-name="fs-4 text-primary">Проекты</Typography>
    </div>

    <div class="content p-2">
      <div
        class="content__projects border w-100 px-1 pb-1 fs-5 rounded bg-white"
        v-for="project in props.projects"
        :key="project"
      >
        <div class="d-flex justify-content-between w-100">
          <Button class-name="fs-5">Проект: {{ project.name }}</Button>
          <Button
            prepend-icon-name="bi bi-caret-up text-primary text-opacity-75"
            class-name="text-primary text-opacity-75"
            v-collapse="project.id"
            >описание</Button
          >
        </div>
        <Collapse :id="project.id">
          <Typography class-name="text-muted ms-3">{{
            project.description
          }}</Typography>
        </Collapse>
      </div>

      <div
        v-if="projects.length === 0"
        class="d-flex w-100 justify-content-center"
      >
        <Typography class-name="fs-5">Проектов нет</Typography>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content {
  width: 100%;
  @include flexible(flex-start, flex-start, column, $gap: 16px);

  &__projects {
    width: 50%;
    @include flexible(flex-start, flex-start, column);
  }
}
</style>
