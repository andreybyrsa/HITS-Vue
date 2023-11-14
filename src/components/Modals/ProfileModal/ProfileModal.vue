<script lang="ts" setup>
import { ref, Ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import ProfileAvatar from '@Components/Modals/ProfileModal/ProfileAvatar.vue'
import ProfileInfo from '@Components/Modals/ProfileModal/ProfileInfo.vue'
import ProfileSkills from '@Components/Modals/ProfileModal/ProfileSkills.vue'
import ProfileProjects from '@Components/Modals/ProfileModal/ProfileProjects.vue'
import ProfileIdeas from '@Components/Modals/ProfileModal/ProfileIdeas.vue'
import ProfileModalPlaceholder from '@Components/Modals/ProfileModal/ProfileModalPlaceholder.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import { Idea } from '@Domain/Idea'
import Project from '@Domain/Project'

import ProfileService from '@Services/ProfileService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { makeParallelRequests, RequestResult } from '@Utils/makeParallelRequests'
import Profile from '@Domain/Profile'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const router = useRouter()
const route = useRoute()

const profileUser = ref<Profile>()
const profileAvatar = ref<FormData>()
const profileSkills = ref<Skill[]>()
const profileIdeas = ref<Idea[]>()
const profileProjects = ref<Project[]>()

const currentUser = user.value
const profileEmail = route.params.email.toString()

let status

if (profileEmail === currentUser?.email) {
  status = true
} else {
  status = false
}

const isOpenedProfileModal = ref(true)

// const fileInputRef: Ref<HTMLInputElement | null> = ref(null)
//const imageUrl: Ref<string | null> = ref(null)
// const selectedFile = ref<File | null>(null)

// const openFileInput = (): void => {
//   if (fileInputRef.value) {
//     fileInputRef.value.value = ''
//     fileInputRef.value.click()
//   }
// }

// const handleFileChange = (event: Event): void => {
// const formData = new FormData()
// const file = (event.target as HTMLInputElement).files?.[0]

// formData.append('file', file.toBlob(), file?.name)

//   const input = event.target as HTMLInputElement
//   selectedFile.value = input.files[0]
//   const formData = new FormData()
//   formData.append('file', selectedFile.value)
//   if (selectedFile.value) {
//     imageUrl.value = URL.createObjectURL(selectedFile.value)
//   }

//   if (user.value?.token) {
//     const { token } = user.value
//     ProfileService.uploadAvatar(formData, token)
//     console.log(formData)
//   }
// }

// const handleFileChange = handleSubmit(async (event: Event) => {
//   const file = (event.target as HTMLInputElement).files?.[0]
//   if (file) {
//     imageUrl.value = URL.createObjectURL(file)

//     if (user.value?.token) {
//       const { token } = user.value
//       await ProfileService.uploadAvatar(file, token)
//     }
//   }
// })

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
    const userEmail = route.params.email.toString()
    const { token } = currentUser

    const profileParallelRequests = [
      () => ProfileService.getUserProfile(userEmail, token),
      //() => ProfileService.getProfileAvatar(userEmail, token),
      // () => ProfileService.getProfileSkills(userEmail, token),
      // () => ProfileService.getProfileIdeas(userEmail, token),
      // () => ProfileService.getProfileProjects(userEmail, token),
    ]

    await makeParallelRequests<Profile | Error>(profileParallelRequests).then(
      (responses) => {
        responses.forEach((response) => {
          if (response.id === 0) {
            checkResponseStatus(response, profileUser)
          }
          // else if (response.id === 1) {
          //   checkResponseStatus(response, profileAvatar)
          // }
          // else if (response.id === 1) {
          //   checkResponseStatus(response, profileSkills)
          // } else if (response.id === 2) {
          //   checkResponseStatus(response, profileIdeas)
          // } else if (response.id === 3) {
          //   checkResponseStatus(response, profileProjects)
          // }
        })
      },
    )
  }
})

function handleCloseProfileModal() {
  isOpenedProfileModal.value = false
  router.go(-1)
}

// console.log(currentUser?.email)
// console.log(profileEmail)
// console.log(profileUser)
</script>

<template>
  <ModalLayout
    :is-opened="isOpenedProfileModal"
    appear-on-render
    @on-outside-close="handleCloseProfileModal"
  >
    <div class="profile-modal p-3 overflow-y-scroll">
      <div
        v-if="profileUser"
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
            {{ profileUser.firstName }} {{ profileUser.lastName }}
          </Typography>
        </div>

        <div class="profile-modal__content">
          <ProfileAvatar
            :user="profileUser"
            :status="status"
          />

          <div class="profile-modal__info">
            <ProfileInfo
              :user="profileUser"
              :status="status"
            />

            <ProfileSkills
              :skills="profileUser.skills"
              :status="status"
            />

            <ProfileIdeas :ideas="profileUser.ideas" />

            <ProfileProjects :projects="profileUser.projects" />
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
