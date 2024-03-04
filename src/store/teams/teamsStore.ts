import { defineStore } from 'pinia'

import { TeamMember } from '@Domain/Team'

import InitialState from '@Store/teams/initialState'
import TeamService from '@Services/TeamService'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import findOneAndUpdate from '@Utils/findOneAndUpdate'
import useProfilesStore from '@Store/profiles/profilesStore'

const useTeamStore = defineStore('teams', {
  state: (): InitialState => ({
    teams: [],
  }),
  getters: {
    getTeams() {
      return async (token: string) => {
        const response = await TeamService.getTeams(token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }

        this.teams = response
        return this.teams
      }
    },

    getTeam() {
      return async (id: string, token: string) => {
        const team = await TeamService.getTeam(id, token)

        if (team instanceof Error) {
          useNotificationsStore().createSystemNotification('Система', team.message)
          return team
        }

        if (this.teams.length) {
          return findOneAndUpdate(this.teams, team, { key: 'id', value: id })
        }

        const teams = await this.getTeams(token)

        if (teams instanceof Error) {
          useNotificationsStore().createSystemNotification('Система', teams.message)
          return teams
        }

        return findOneAndUpdate(this.teams, team, { key: 'id', value: id })
      }
    },
  },
  actions: {
    async addTeamMember(teamMember: TeamMember, token: string) {
      const response = await TeamService.addTeamMember(teamMember, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentTeam = this.teams.find(({ id }) => id === teamMember.teamId)

        if (currentTeam) {
          currentTeam.members.push({ ...teamMember, id: teamMember.userId })
          currentTeam.membersCount++
        }
      }
    },

    async changeLeaderTeamMember(
      teamId: string,
      teamMember: TeamMember,
      token: string,
    ) {
      const { id: userId } = teamMember
      const response = await TeamService.appointLeaderTeam(teamId, teamMember, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentTeam = this.teams.find(({ id }) => id === teamId)
        const newLeader = currentTeam?.members.find(({ id }) => id === userId)

        if (currentTeam && newLeader) {
          currentTeam.leader = newLeader
        }
      }
    },

    async kickTeamMember(teamId: string, teamMemberId: string, token: string) {
      const response = await TeamService.kickTeamMember(teamId, teamMemberId, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const profileStore = useProfilesStore()
        const currentTeam = this.teams.find(({ id }) => id === teamId)

        if (currentTeam) {
          const currentTeamMemberIndex = currentTeam.members.findIndex(
            ({ id }) => id === teamMemberId,
          )

          if (currentTeamMemberIndex !== -1) {
            currentTeam.members.splice(currentTeamMemberIndex, 1)
            currentTeam.membersCount--
          }
        }

        await profileStore.finishTeamExperience(teamMemberId, teamId, token)
      }
    },

    async leaveFromTeam(teamId: string, teamMemberId: string, token: string) {
      const response = await TeamService.leaveFromTeam(teamId, teamMemberId, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const profileStore = useProfilesStore()
        const currentTeam = this.teams.find(({ id }) => id === teamId)

        if (currentTeam) {
          const currentTeamMemberIndex = currentTeam.members.findIndex(
            ({ id }) => id === teamMemberId,
          )

          if (currentTeamMemberIndex !== -1) {
            currentTeam.members.splice(currentTeamMemberIndex, 1)
            currentTeam.membersCount--
          }
        }

        await profileStore.finishTeamExperience(teamMemberId, teamId, token)
      }
    },

    async deleteTeam(id: string, token: string) {
      const response = await TeamService.deleteTeam(id, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const deletingIdeaIndex = this.teams.findIndex((team) => team.id === id)

        if (deletingIdeaIndex !== -1) {
          this.teams.splice(deletingIdeaIndex, 1)
        }
      }
    },
  },
})

export default useTeamStore
