import { defineStore } from 'pinia'
import { Skill, ProfileFullName, User, Profile } from '@Domain'
import { useNotification } from '@Hooks'
import { useUserStore } from '@Store'
import { ProfileService } from '@Service'
import { findOneAndUpdate } from '@Utils'

type StoredAvatar = { id: string; avatar: string }

interface InitialState {
  avatars: StoredAvatar[]
  profiles: Profile[]
}

export const useProfilesStore = defineStore('profiles', {
  state: (): InitialState => ({ avatars: [], profiles: [] }),

  getters: {
    fetchUserProfile() {
      return async (userId: string) => {
        const response = await ProfileService.getUserProfile(userId)

        if (response instanceof Error) {
          return response
        }

        return findOneAndUpdate(this.profiles, response, {
          key: 'id',
          value: userId,
        })
      }
    },

    fetchProfileAvatar() {
      return async (userId: string) => {
        const response = await ProfileService.getProfileAvatar(userId)

        if (response instanceof Error) {
          return response
        }

        const avatar = response?.length ? `data:image/jpeg;base64,${response}` : ''
        const storedAvatar: StoredAvatar = { id: userId, avatar }

        findOneAndUpdate(this.avatars, storedAvatar, { key: 'id', value: userId })

        return avatar
      }
    },

    getProfileByUserId(state) {
      return (userId: string) => state.profiles.find(({ id }) => id === userId)
    },

    getProfileAvatarByUserId(state) {
      return (userId: string) =>
        state.avatars.find(({ id }) => id === userId)?.avatar
    },
  },

  actions: {
    async uploadAvatar(userId: string, image: File, formDataImage: FormData) {
      const response = await ProfileService.uploadProfileAvatar(formDataImage)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const currentAvatar = this.avatars.find(({ id }) => id === userId)

      if (currentAvatar) {
        currentAvatar.avatar = URL.createObjectURL(image)
      }
    },

    async saveProfileSkills(userId: string, skills: Skill[]) {
      const response = await ProfileService.saveProfileSkills(skills)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const currentProfile = this.profiles.find(({ id }) => id === userId)

      if (currentProfile) {
        currentProfile.skills = skills
      }
    },

    async updateUserFullName(user: User) {
      const userStore = useUserStore()
      const { id: userId, lastName, firstName } = user
      const fullName: ProfileFullName = { lastName, firstName }
      const response = await ProfileService.updateUserFullName(fullName)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const currentProfile = this.profiles.find(({ id }) => id === userId)
      const currentUser = userStore.user

      if (currentProfile && currentUser) {
        currentProfile.firstName = firstName
        currentProfile.lastName = lastName

        userStore.setUser({ ...currentUser, firstName, lastName })
      }
    },
  },
})
