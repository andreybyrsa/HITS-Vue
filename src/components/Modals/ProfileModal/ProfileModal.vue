<script lang="ts" setup>
import { ref, Ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

import ProfileAvatar from '@Components/Modals/ProfileModal/ProfileAvatar.vue'
import ProfileInfo from '@Components/Modals/ProfileModal/ProfileInfo.vue'
import ProfileSkills from '@Components/Modals/ProfileModal/ProfileSkills.vue'
import ProfileProjects from '@Components/Modals/ProfileModal/ProfileProjects.vue'
import ProfileIdeas from '@Components/Modals/ProfileModal/ProfileIdeas.vue'
import ProfileModalPlaceholder from '@Components/Modals/ProfileModal/ProfileModalPlaceholder.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import { ProfileModalProps } from '@Components/Modals/ProfileModal/ProfileModal.types'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import Profile from '@Domain/Profile'

import ProfileService from '@Services/ProfileService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { makeParallelRequests, RequestResult } from '@Utils/makeParallelRequests'

const props = defineProps<ProfileModalProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const router = useRouter()
const route = useRoute()

const profile = ref<Profile>()

const isOpenedProfileModal = ref(true)
const isOwnProfile = ref<boolean>()

function checkResponseStatus<T>(
  data: RequestResult<T>,
  refValue: Ref<T | undefined>,
) {
  if (data.status === 'fulfilled') {
    refValue.value = data.value
  } else {
    notificationsStore.createSystemNotification('Система', `${data.value}`)
  }
}

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const profileId = route.params.id.toString()
    const { token, id } = currentUser

    const profileParallelRequests = [
      () => ProfileService.getUserProfile(profileId, token),
      () => ProfileService.getProfileAvatar(profileId, token),
    ]

    await makeParallelRequests<Profile | string | Error>(
      profileParallelRequests,
    ).then((responses) => {
      responses.forEach((response) => {
        if (response.id === 0) {
          checkResponseStatus(response, profile)
        }
        if (response.id === 1) {
          console.log(response.value)
        }
      })
    })

    isOwnProfile.value = profileId === id
  }
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
        v-if="profile"
        class="w-100"
      >
        <div class="profile-modal__header mb-3">
          <Button
            class-name="btn-primary"
            prepend-icon-name="bi bi-backspace-fill"
            @click="handleCloseProfileModal"
          >
            Назад
          </Button>

          <Typography
            class-name="p-2 w-100 bg-white rounded-3 fs-4 text-primary text-nowrap overflow-scroll-hidden"
          >
            {{ profile.firstName }} {{ profile.lastName }}
          </Typography>
        </div>

        <div class="profile-modal__content">
          <ProfileAvatar :profile="profile" />

          <div class="profile-modal__info">
            <ProfileInfo v-model="profile" />

            <ProfileSkills :profile="profile" />

            <ProfileIdeas :profile="profile" />

            <ProfileProjects :profile="profile" />
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
    height: 100%;
    @include flexible(stretch, flex-start, $gap: 16px);
  }

  &__info {
    width: 66%;
    height: 100%;
    display: block;
    @include flexible(center, flex-start, column, $gap: 16px);
  }
}

.modal-layout-enter-from .profile-modal,
.modal-layout-leave-to .profile-modal {
  transform: translateX(100%);
}
</style>
