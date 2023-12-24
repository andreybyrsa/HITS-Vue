import { defineStore } from 'pinia'

import { Skill } from '@Domain/Skill'

import ProfileService from '@Services/ProfileService'

import { InitialState, StoredAvatar } from '@Store/profiles/initialState'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import findOneAndUpdate from '@Utils/findOneAndUpdate'

const profilesStore = defineStore('profiles', {
  state: (): InitialState => ({ avatars: [], profiles: [] }),

  getters: {
    fetchUserProfile() {
      return async (userId: string, token: string) => {
        const response = await ProfileService.getUserProfile(userId, token)

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
      return async (userId: string, token: string) => {
        const response = await ProfileService.getProfileAvatar(userId, token)

        if (response instanceof Error) {
          return response
        }

        const avatar = response.length ? `data:image/jpeg;base64,${response}` : ''
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
    async uploadAvatar(
      userId: string,
      image: File,
      formDataImage: FormData,
      token: string,
    ) {
      const response = await ProfileService.uploadProfileAvatar(formDataImage, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentAvatar = this.avatars.find(({ id }) => id === userId)

        if (currentAvatar) {
          currentAvatar.avatar = URL.createObjectURL(image)
        }
      }
    },

    async saveProfileSkills(userId: string, skills: Skill[], token: string) {
      const response = await ProfileService.saveProfileSkills(skills, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentProfile = this.profiles.find(({ id }) => id === userId)

        if (currentProfile) {
          currentProfile.skills = skills
        }
      }
    },
  },
})

export default profilesStore
