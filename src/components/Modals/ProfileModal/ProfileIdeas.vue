<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import Icon from '@Components/Icon/Icon.vue'
import Typography from '@Components/Typography/Typography.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'

import useProfilesStore from '@Store/profiles/profilesStore'

import { getIdeaStatus, getIdeaStatusStyle } from '@Utils/ideaStatus'

const router = useRouter()
const route = useRoute()
const profileId = route.params.id.toString()

const profilesStore = useProfilesStore()
const profile = computed(() => profilesStore.getProfileByUserId(profileId))

const status = getIdeaStatus()

function navigateToIdeaModal(ideaId: string) {
  router.push(`/ideas/list/${ideaId}`)
}
</script>

<template>
  <div class="profile-ideas w-100 bg-white border p-3 rounded-3">
    <div class="profile-ideas__header border-bottom">
      <Typography class-name="fs-5 text-primary">Идеи</Typography>
    </div>

    <div
      v-if="profile?.ideas"
      class="profile-ideas__content mt-3"
    >
      <template v-if="profile.ideas.length > 0">
        <div
          class="profile-ideas__idea w-100 p-2 bg-white border rounded"
          v-for="idea in profile.ideas"
          :key="idea.id"
        >
          <div class="w-100 d-flex justify-content-between align-items-center gap-3">
            <div class="d-flex gap-2 align-items-center">
              <div
                class="fs-5 profile-ideas__idea-link"
                @click="navigateToIdeaModal(idea.id)"
              >
                {{ idea.name }}
              </div>
              <div :class="[getIdeaStatusStyle(idea.status), 'fs-6', 'text-center']">
                {{ status.translatedStatus[idea.status] }}
              </div>
            </div>
            <div
              class="profile-ideas__idea-open-button d-flex align-items-center gap-1"
              v-collapse="`${idea.id}`"
            >
              <Typography class-name="text-primary">Описание</Typography>
              <Icon class-name="bi bi-caret-down text-primary" />
            </div>
          </div>

          <Collapse
            :id="`${idea.id}`"
            class-name="w-100"
          >
            <Typography class-name="w-100 mt-1 border-top text-secondary">
              {{ idea.description }}
            </Typography>
          </Collapse>
        </div>
      </template>

      <div
        v-else
        class="d-flex w-100 justify-content-center"
      >
        <Typography class-name="fs-5">Идей пока нет</Typography>
      </div>
    </div>

    <div
      v-else
      class="profile-ideas__content p-2"
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
