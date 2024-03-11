<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Profile } from '@Domain'
import { useProfilesStore } from '@Store'
import { sendParallelRequests, RequestConfig, openErrorNotification } from '@Utils'
import { ProfileModalProps } from '@Components/Modals/ProfileModal/ProfileModal.types'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import ProfileAvatar from '@Components/Modals/ProfileModal/ProfileAvatar.vue'
import ProfileInfo from '@Components/Modals/ProfileModal/ProfileInfo.vue'
import ProfileSkills from '@Components/Modals/ProfileModal/ProfileSkills.vue'
import ProfileIdeas from '@Components/Modals/ProfileModal/ProfileIdeas.vue'
import ProfilePortfolio from '@Components/Modals/ProfileModal/ProfilePortfolio.vue'
import ProfileModalPlaceholder from '@Components/Modals/ProfileModal/ProfileModalPlaceholder.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'

const props = defineProps<ProfileModalProps>()

const router = useRouter()
const route = useRoute()
const profileId = route.params.id.toString()

const profilesStore = useProfilesStore()
const profile = computed(() => profilesStore.getProfileByUserId(profileId))

const DBProfile = ref<Profile>()
const DBProfileAvatar = ref<string>()

const isOpenedProfileModal = ref(true)

onMounted(async () => {
  const profileParallelRequests: RequestConfig[] = [
    {
      request: () => profilesStore.fetchUserProfile(profileId),
      refValue: DBProfile,
      onErrorFunc: openErrorNotification,
    },
    {
      request: () => profilesStore.fetchProfileAvatar(profileId),
      refValue: DBProfileAvatar,
      onErrorFunc: openErrorNotification,
    },
  ]

  await sendParallelRequests(profileParallelRequests)
})

function handleCloseProfileModal() {
  if (props.canGoBack) {
    return router.go(-1)
  }

  const parentBaseRoute = route.matched[route.matched.length - 2].path

  isOpenedProfileModal.value = false
  router.push({ path: parentBaseRoute })
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpenedProfileModal"
    appear-on-render
    @on-outside-close="handleCloseProfileModal"
  >
    <div class="profile-modal p-3 overflow-y-scroll">
      <div
        v-if="DBProfile"
        class="w-100"
      >
        <div class="profile-modal__header mb-3">
          <Button
            variant="primary"
            prepend-icon-name="bi bi-backspace-fill"
            @click="handleCloseProfileModal"
          >
            Назад
          </Button>

          <Typography
            class-name="p-2 w-100 bg-white rounded-3 fs-4 text-primary text-nowrap overflow-scroll-hidden"
          >
            {{ profile?.firstName }} {{ profile?.lastName }}
          </Typography>
        </div>

        <div class="profile-modal__content">
          <div class="d-flex flex-column gap-3 w-75">
            <ProfileAvatar />

            <ProfileInfo />
          </div>

          <div class="profile-modal__info mb-3">
            <ProfileSkills />

            <ProfileIdeas />

            <ProfilePortfolio />
          </div>
        </div>
      </div>

      <ProfileModalPlaceholder v-else />
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.profile-modal {
  position: relative;
  height: 100%;
  width: 80%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #e9e9e9;

  @include flexible(
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;

  &__placeholders {
    &-first {
      width: 33%;
      height: 100%;
      @include flexible(start, start, column, $gap: 16px);
    }

    &-second {
      width: 66%;
      height: 100%;
      @include flexible(start, start, column, $gap: 16px);
    }
  }

  &__header {
    @include flexible(stretch, flex-start, $gap: 16px);
  }

  &__content {
    width: 100%;
    @include flexible(stretch, flex-start, $gap: 16px);
  }

  &__info {
    width: 100%;
    height: 100%;

    @include flexible(center, flex-start, column, $gap: 16px);
  }
}

.modal-layout-enter-from .profile-modal,
.modal-layout-leave-to .profile-modal {
  transform: translateX(100%);
}
</style>
