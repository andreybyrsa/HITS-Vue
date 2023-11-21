<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import Typography from '@Components/Typography/Typography.vue'
import Team from '@Domain/Team'

const team = defineModel<Team>({ required: true })
</script>

<template>
  <div
    v-if="team.projects"
    class="bg-white rounded-3"
  >
    <Button
      class-name="collapse-controller fs-4 btn-light w-100"
      v-collapse="'teamProjects' + team.id"
    >
      Наши проекты
    </Button>
    <Collapse
      class-name="collapse-content"
      :id="'teamProjects' + team.id"
      ><div
        class="field"
        v-for="project in team.projects"
        :key="project.id"
      >
        <Button class-name="project w-100">
          <Typography class-name="fs-5 text-dark text-start"
            >Проект: {{ project.name }}</Typography
          >
        </Button>
      </div></Collapse
    >
  </div>
</template>

<style lang="scss" scoped>
.project {
  @include flexible(flex-start, flex-end, column, $gap: 16px);
}
</style>
