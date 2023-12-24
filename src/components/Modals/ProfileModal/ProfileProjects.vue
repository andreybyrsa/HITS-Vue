<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Typography from '@Components/Typography/Typography.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import Icon from '@Components/Icon/Icon.vue'

import useProfilesStore from '@Store/profiles/profilesStore'

const router = useRouter()
const route = useRoute()
const profileId = route.params.id.toString()

const profilesStore = useProfilesStore()
const profile = computed(() => profilesStore.getProfileByUserId(profileId))

function navigateToProjectModal(projectId: string) {
  router.push(`/projects/list/${projectId}`)
}
</script>

<template>
  <div class="profile-projects w-100 bg-white border p-3 rounded-3">
    <div class="profile-projects__header border-bottom">
      <Typography class-name="fs-5 text-primary">Проекты</Typography>
    </div>

    <div
      v-if="profile?.projects"
      class="profile-projects__content mt-3"
    >
      <template v-if="profile.projects.length > 0">
        <div
          class="profile-projects__project w-100 p-2 bg-white border rounded"
          v-for="project in profile.projects"
          :key="project.id"
        >
          <div class="w-100 d-flex justify-content-between align-items-center">
            <div
              class="profile-projects__project-link fs-5"
              @click="navigateToProjectModal(project.id)"
            >
              {{ project.name }}
            </div>
            <div
              class="profile-projects__project-open-button d-flex align-items-center gap-1"
              v-collapse="`${project.id}`"
            >
              <Typography class-name="text-primary">Описание</Typography>
              <Icon class-name="bi bi-caret-down text-primary" />
            </div>
          </div>

          <Collapse
            :id="`${project.id}`"
            class-name="w-100"
          >
            <Typography class-name="w-100 border-top text-secondary">
              {{ project.description }}
            </Typography>
          </Collapse>
        </div>
      </template>

      <div
        v-else
        class="d-flex w-100 justify-content-center"
      >
        <Typography class-name="fs-5">Проектов пока нет</Typography>
      </div>
    </div>

    <div
      v-else
      class="profile-projects__content mt-3"
    >
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
</template>

<style lang="scss" scoped>
.profile-projects {
  &__header {
    @include flexible(center, space-between);
  }

  &__content {
    @include flexible(flex-start, flex-start, column, $gap: 16px);
  }

  &__project {
    @include flexible(flex-start, flex-start, column);

    &-link {
      cursor: pointer;

      &:hover {
        text-decoration: underline;
        text-underline-offset: 4px;
        text-decoration-thickness: 1px;
      }
    }

    &-open-button {
      cursor: pointer;
    }
  }
}
</style>
