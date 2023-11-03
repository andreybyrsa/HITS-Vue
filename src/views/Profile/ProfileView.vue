<script lang="ts" setup>
import { ref, Ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { ProfileProps, ProfileEmits } from '@Views/Profile/Profile.types'
import useCommentsStore from '@Store/comments/commentsStore'
import { makeParallelRequests, RequestResult } from '@Utils/makeParallelRequests'
import ProfileService from '@Services/ProfileService'
import useUserStore from '@Store/user/userStore'
import { useRoute, useRouter } from 'vue-router'
import useNotification from '@Hooks/useNotification'
import { Idea } from '@Domain/Idea'
import { Project } from '@Domain/Project'
import { Skill } from '@Domain/Skill'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import LoadingPlaceholder from '@Components/LoadingPlaceholder/LoadingPlaceholder.vue'

import User from './User.vue'
import Info from './Info.vue'
import Skills from './Skills.vue'
import Projects from './Projects.vue'
import Ideas from './Ideas.vue'
import ProfilePlaceholder from './ProfilePlaceholder.vue'

defineProps<ProfileProps>()
const emit = defineEmits<ProfileEmits>()

const { handleOpenNotification } = useNotification()

const commentStore = useCommentsStore()
const { rsocketIsConnected, closeRsocket } = storeToRefs(commentStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const router = useRouter()
const route = useRoute()

const isLoading = ref(true)

const skills = ref<Skill[]>([])
const projects = ref<Project[]>([])
const ideas = ref<Idea[]>([])

const startTimer = () => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

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

const { values, handleSubmit } = useForm({
  validationSchema: {
    component: (value: string) => value?.length || 'Обязательно к заполнению',
  },
})

function closeProfile() {
  emit('close-modal')
}

function checkResponseStatus<T>(
  data: RequestResult<T>,
  refValue: Ref<T | undefined>,
) {
  if (data.status === 'fulfilled') {
    refValue.value = data.value
  } else {
    // notification
  }
}

onMounted(async () => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const profileParallelRequests = [
      () => ProfileService.getUserIdeas(token),
      () => ProfileService.getUserProjects(token),
      () => ProfileService.getSkills(token),
      //() => ProfileService.getAvatar(token),
    ]

    await makeParallelRequests<Idea[] | Project[] | Skill[] | Error>(
      profileParallelRequests,
    ).then((responses) => {
      responses.forEach((response) => {
        if (response.id === 0) {
          checkResponseStatus(response, ideas)
        } else if (response.id === 1) {
          checkResponseStatus(response, projects)
        } else if (response.id === 2) {
          checkResponseStatus(response, skills)
        }
      })
    })

    isLoading.value = false
  }
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="closeProfile"
    class="layout"
  >
    <div class="profile p-3 overflow-y-scroll">
      <div class="w-100 h-100">
        <ProfilePlaceholder v-if="isLoading"></ProfilePlaceholder>

        <div v-else>
          <div class="profile__header w-100 mb-3">
            <Button
              class-name="btn-primary"
              prepend-icon-name="bi bi-backspace-fill"
              @click="emit('close-modal')"
            >
              Назад
            </Button>

            <Typography
              class-name="p-2 w-100 bg-white rounded-3 fs-4 text-primary text-nowrap overflow-scroll-hidden"
            >
              {{ user.lastName }} {{ user.firstName }}
            </Typography>
          </div>

          <div class="profile__content">
            <User
              :roles="user.roles"
              :role="user.role"
              :lastActivity="user.lastActivity"
            ></User>

            <div class="profile__info">
              <Info
                :firstName="user.firstName"
                :lastName="user.lastName"
                :email="user.email"
                :role="user.role"
                :roles="user.roles"
              ></Info>

              <Skills :skills="skills"></Skills>

              <Projects :projects="projects"></Projects>

              <Ideas :ideas="ideas"></Ideas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.profile {
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
    width: 100%;
    height: fit-content;
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

.modal-layout-enter-from .profile,
.modal-layout-leave-to .profile {
  transform: translateX(100%);
}
</style>
