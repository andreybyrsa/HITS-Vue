<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, RouteRecordRaw } from 'vue-router'

import Icon from '@Components/Icon/Icon.vue'
import Typography from '@Components/Typography/Typography.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'
import IdeaModal from '@Components/Modals/IdeaModal/IdeaModal.vue'

import useProfilesStore from '@Store/profiles/profilesStore'

import { getIdeaStatus, getIdeaStatusStyle } from '@Utils/ideaStatus'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'

import { Profile } from '@Domain/Profile'
import useUserStore from '@Store/user/userStore'

import {
  sendParallelRequests,
  RequestConfig,
  openErrorNotification,
} from '@Utils/sendParallelRequests'

const route = useRoute()
const profileId = route.params.id.toString()

const profilesStore = useProfilesStore()
const profile = computed(() => profilesStore.getProfileByUserId(profileId))

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const status = getIdeaStatus()

const DBProfile = ref<Profile>()

function navigateToIdeaModal(ideaId: string) {
  const nestedRouteName = route.matched[route.matched.length - 2].name?.toString()
  const ideaModalRoute: RouteRecordRaw = {
    name: 'idea-modal',
    path: 'ideas/list/:id',
    alias: '/ideas/list/:id',
    component: IdeaModal,
    props: {
      canGoBack: true,
    },
  }

  if (nestedRouteName) {
    navigateToAliasRoute(nestedRouteName, `/ideas/list/${ideaId}`, ideaModalRoute)
  }
}

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const profileParallelRequests: RequestConfig[] = [
      {
        request: () => profilesStore.fetchUserProfile(profileId, token),
        refValue: DBProfile,
        onErrorFunc: openErrorNotification,
      },
    ]

    await sendParallelRequests(profileParallelRequests)
  }
})
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
            <div
              class="w-100 d-flex gap-2 align-items-center justify-content-between"
            >
              <div
                class="fs-6 profile-ideas__idea-link w-100"
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
              {{ idea.solution }}
            </Typography>
          </Collapse>
        </div>
      </template>

      <div
        v-else
        class="d-flex w-100 justify-content-center"
      >
        <Typography class-name="fs-6 text-secondary">Идей пока нет</Typography>
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
      @include textEllipsis(1);

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
