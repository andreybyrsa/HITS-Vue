import { ref } from 'vue'
import { defineStore } from 'pinia'

import { Skill } from '@Domain/Skill'

import ProfileService from '@Services/ProfileService'

import { InitialState, StoredAvatar } from '@Store/profiles/initialState'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import findOneAndUpdate from '@Utils/findOneAndUpdate'
import { Profile, ProfileFullName } from '@Domain/Profile'
import { User, UserTelegram } from '@Domain/User'
import useUserStore from '@Store/user/userStore'
import { TeamExperience } from '@Domain/Team'
import TeamService from '@Services/TeamService'
import LocalStorageTelegramTag from '@Utils/LocalStorageTelegramTag'

const useProfilesStore = defineStore('profiles', {
  state: (): InitialState => ({
    avatars: [],
    profiles: [],
    usersTelegram: [],
  }),

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

    fetchUserTelegram() {
      return async (userId: string, token: string) => {
        const response = await ProfileService.getUserTelegram(userId, token)

        if (response instanceof Error) {
          return response
        }

        return findOneAndUpdate(this.usersTelegram, response, {
          key: 'userId',
          value: userId,
        })
      }
    },

    getProfileByUserId(state) {
      return (userId: string) => state.profiles.find(({ id }) => id === userId)
    },

    getProfileAvatarByUserId(state) {
      return (userId: string) =>
        state.avatars.find(({ id }) => id === userId)?.avatar
    },
    getUserTagByUserId(state) {
      return (userId: string) =>
        state.usersTelegram.find(({ userId: id }) => id === userId)?.userTag
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

    setProfileTag(tag: string, userId: string) {
      const currentUserTelegram = this.usersTelegram.find(
        ({ userId: id }) => id === userId,
      )
      if (!currentUserTelegram) return
      currentUserTelegram.userTag = tag
    },

    async updateUserFullName(user: User, token: string, id: string) {
      const userStore = useUserStore()
      const { id: userId, lastName, firstName, studyGroup, telephone } = user

      const fullName: ProfileFullName = {
        lastName,
        firstName,
        studyGroup,
        telephone,
        id: userId,
      }

      const response = await ProfileService.updateUserFullName(fullName, token, id)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentProfile = this.profiles.find(({ id }) => id === userId)
        const currentUser = userStore.user

        if (currentProfile && currentUser) {
          currentProfile.firstName = firstName
          currentProfile.lastName = lastName

          userStore.setUser({
            ...currentUser,
            firstName,
            lastName,
            studyGroup,
            telephone,
          })
        }
      }
    },

    async updateUserTelegramTag(userTelegram: UserTelegram, token: string) {
      const { userId, userTag } = userTelegram
      const newUserTelegram = { ...userTelegram, userTag } as UserTelegram

      if (!userTag) return
      const response = await ProfileService.updateTelegramTag(
        newUserTelegram,
        userTelegram.userId,
        token,
      )

      if (userTag) {
        this.setProfileTag(userTag, userId)
      }

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return
      }
    },

    async updateVisibilityOfTag(
      user: User,
      userTelegram: UserTelegram,
      token: string,
    ) {
      const userStore = useUserStore()
      const { id: userId } = user
      const { userTag, isUserTagVisible: isVisible } = userTelegram

      if (isVisible === true) {
        const response = await ProfileService.updateVisibilityOfTag(
          userTag,
          true,
          token,
        )
        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
        } else {
          const currentProfile = this.profiles.find(({ id }) => id === userId)
          const currentUser = userStore.user

          if (currentProfile && currentUser) {
            currentProfile.isUserTagVisible = isVisible

            userStore.setUser({ ...currentUser })
          }
        }
      } else {
        const response = await ProfileService.updateVisibilityOfTag(
          userTag,
          false,
          token,
        )
        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
        } else {
          const currentProfile = this.profiles.find(({ id }) => id === userId)
          const currentUser = userStore.user

          if (currentProfile && currentUser) {
            currentProfile.isUserTagVisible = isVisible

            userStore.setUser({ ...currentUser })
          }
        }
      }
    },

    async addTeamExperince(teamExperience: TeamExperience, token: string) {
      const { userId } = teamExperience
      const response = await TeamService.addTeamExperince(teamExperience, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentProfile = this.profiles.find(({ id }) => id === userId)

        if (currentProfile) {
          currentProfile.teamsExperience.push(teamExperience)
        }
      }
    },

    async finishTeamExperience(userId: string, teamId: string, token: string) {
      const response = await TeamService.finishTeamExperience(teamId, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentProfile = this.profiles.find((profile) => profile.id === userId)

        if (currentProfile) {
          const currentTeamExperience = currentProfile.teamsExperience.find(
            (team) =>
              team.teamId === teamId && team.userId === userId && !team.finishDate,
          )

          if (currentTeamExperience) {
            const currentDate = new Date().toJSON().toString()
            currentTeamExperience.finishDate = currentDate
            currentTeamExperience.hasActiveProject = false
          }
        }
      }
    },
  },
})

export default useProfilesStore
