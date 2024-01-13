import { defineStore } from 'pinia'

import { Skill } from '@Domain/Skill'

import ProfileService from '@Services/ProfileService'

import { InitialState, StoredAvatar } from '@Store/profiles/initialState'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import findOneAndUpdate from '@Utils/findOneAndUpdate'
import { ProfileFullName } from '@Domain/Profile'
import { User } from '@Domain/User'
import useUserStore from '@Store/user/userStore'
import useTeamStore from '@Store/teams/teamsStore'
import { TeamExperience } from '@Domain/Team'

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

    async updateUserFullName(user: User, token: string) {
      const userStore = useUserStore()
      const { id: userId, lastName, firstName } = user

      const fullName: ProfileFullName = { lastName, firstName }

      const response = await ProfileService.updateUserFullName(fullName, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentProfile = this.profiles.find(({ id }) => id === userId)
        const currentUser = userStore.user

        if (currentProfile && currentUser) {
          currentProfile.firstName = firstName
          currentProfile.lastName = lastName

          userStore.setUser({ ...currentUser, firstName, lastName })
        }
      }
    },

    finishTeamExperience(userId: string, teamId: string) {
      const currentProfile = this.profiles.find((profile) => profile.id === userId)

      if (currentProfile) {
        const currentTeamExperience = currentProfile.teamsExperience.find(
          (team) => team.teamId === teamId && team.userId === userId,
        )
        const currentTeamsProjects = currentProfile.teamsProjects.find(
          (team) => team.teamId === teamId && team.userId === userId,
        )

        if (currentTeamExperience && currentTeamsProjects) {
          const currentDate = new Date().toJSON().toString()
          currentTeamExperience.finishDate = currentDate
          currentTeamExperience.hasActiveProject = false
          currentTeamsProjects.finishDate = currentDate
        }
      }
    },

    addTeamExperience(userId: string, teamId: string) {
      const teamsStore = useTeamStore()

      const currentTeam = teamsStore.teams.find(({ id }) => id === teamId)
      const currentProfile = this.profiles.find((profile) => profile.id === userId)

      if (currentTeam && currentProfile) {
        const { name, id } = currentTeam

        const newTeamExperience: TeamExperience = {
          teamId: id,
          teamName: name,
          userId: userId,
          firstName: '',
          lastName: '',
          startDate: new Date().toJSON().toString(),
          finishDate: null,
          hasActiveProject: false,
        }

        currentProfile.teamsExperience.push(newTeamExperience)
      }
    },
  },
})

export default profilesStore
