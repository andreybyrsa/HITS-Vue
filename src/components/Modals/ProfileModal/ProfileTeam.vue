<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, RouteRecordRaw } from 'vue-router'

import Icon from '@Components/Icon/Icon.vue'
import Typography from '@Components/Typography/Typography.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import TeamModal from '@Components/Modals/TeamModal/TeamModal.vue'

import useProfilesStore from '@Store/profiles/profilesStore'

import navigateToAliasRoute from '@Utils/navigateToAliasRoute'

const route = useRoute()
const profileId = route.params.id.toString()

const profilesStore = useProfilesStore()
const profile = computed(() => profilesStore.getProfileByUserId(profileId))

function navigateToIdeaModal(ideaId: string) {
  const nestedRouteName = route.matched[route.matched.length - 2].name?.toString()
  const ideaModalRoute: RouteRecordRaw = {
    name: 'team-modal',
    path: 'team/:teamId',
    alias: '/team/:teamId',
    component: TeamModal,
    meta: { from: nestedRouteName },
    props: {
      canGoBack: true,
    },
  }

  if (nestedRouteName) {
    navigateToAliasRoute(nestedRouteName, `/team/${ideaId}`, ideaModalRoute)
  }
}

function getStatusStyle(closed: boolean) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (closed) {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }

  initialClass.push('bg-success-subtle', 'text-success')
  return initialClass
}

function getTranslatedStatus(closed: boolean) {
  return closed ? 'Закрыта' : 'Открыта'
}
</script>

<template>
  <div class="profile-ideas w-100 bg-white border p-3 rounded-3">
    <div class="profile-ideas__header border-bottom">
      <Typography class-name="fs-5 text-primary">Команда</Typography>
    </div>

    <div
      v-if="profile?.team"
      class="profile-ideas__content mt-3"
    >
      <div class="profile-ideas__idea w-100 p-2 bg-white border rounded">
        <div class="w-100 d-flex justify-content-between align-items-center gap-3">
          <div class="w-100 d-flex gap-2 align-items-center justify-content-between">
            <div
              class="fs-6 profile-ideas__idea-link"
              @click="navigateToIdeaModal(profile.team.id)"
            >
              {{ profile.team.name }}
            </div>
            <div :class="[getStatusStyle(profile.team.closed)]">
              {{ getTranslatedStatus(profile.team.closed) }}
            </div>
          </div>
          <div
            class="profile-ideas__idea-open-button d-flex align-items-center gap-1"
            v-collapse="profile.team.id"
          >
            <Typography class-name="text-primary">Описание</Typography>
            <Icon class-name="bi bi-caret-down text-primary" />
          </div>
        </div>

        <Collapse
          :id="profile.team.id"
          class-name="w-100"
        >
          <Typography class-name="w-100 mt-1 border-top text-secondary">
            {{ profile.team.description }}
          </Typography>
        </Collapse>
      </div>
    </div>

    <div
      v-else
      class="d-flex w-100 justify-content-center"
    >
      <Typography class-name="fs-6 text-secondary"
        >В команду пока не вступил</Typography
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-ideas {
  &__header {
    @include flexible(center, space-between);
  }

  &__content {
    @include flexible(flex-start, flex-start, column, $gap: 16px);
  }

  &__idea {
    @include flexible(flex-start, center, column, $gap: 8px);

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
