import { defineStore } from 'pinia'

import { Skill } from '@Domain/Skill'

import ProfileService from '@Services/ProfileService'

import InitialState from '@Store/profile/initialState'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const profileStore = defineStore('profile', {
  state: (): InitialState => ({ avatar: null, profile: null }),

  getters: {
    getUserProfile() {
      return async (id: string, token: string) => {
        const response = await ProfileService.getUserProfile(id, token)

        if (response instanceof Error) {
          return response
        }

        this.profile = response
        return this.profile
      }
    },

    getProfileAvatar() {
      return async (id: string, token: string) => {
        const response = await ProfileService.getProfileAvatar(id, token)

        if (response instanceof Error) {
          return response
        }

        if (response.length) {
          this.avatar = `data:image/jpeg;base64,${response}`
        }
        return this.avatar
      }
    },
  },

  actions: {
    async uploadAvatar(image: File, formDataImage: FormData, token: string) {
      const response = await ProfileService.uploadProfileAvatar(formDataImage, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.avatar = URL.createObjectURL(image)
      }
    },

    async saveProfileSkills(skills: Skill[], token: string) {
      const response = await ProfileService.saveProfileSkills(skills, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else if (this.profile) {
        this.profile.skills = skills
      }
    },
  },
})

export default profileStore
