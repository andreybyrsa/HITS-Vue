import { defineStore } from 'pinia'
import { Team, TeamMember } from '@Domain'
import { useNotification } from '@Hooks'
import { TeamService } from '@Service'
import { findOneAndUpdate } from '@Utils'

interface InitialState {
  teams: Team[]
}

export const useTeamStore = defineStore('teams', {
  state: (): InitialState => ({
    teams: [],
  }),
  getters: {
    getTeams() {
      return async () => {
        const response = await TeamService.getTeams()

        if (response instanceof Error) {
          useNotification('Система', response.message)
          return response
        }

        this.teams = response
        return this.teams
      }
    },

    getTeam() {
      return async (id: string) => {
        const team = await TeamService.getTeam(id)

        if (team instanceof Error) {
          useNotification('Система', team.message)
          return team
        }

        if (this.teams.length) {
          return findOneAndUpdate(this.teams, team, { key: 'id', value: id })
        }

        const teams = await this.getTeams()

        if (teams instanceof Error) {
          useNotification('Система', teams.message)
          return teams
        }

        return findOneAndUpdate(this.teams, team, { key: 'id', value: id })
      }
    },
  },
  actions: {
    async addTeamMember(teamMember: TeamMember) {
      const response = await TeamService.addTeamMember(teamMember)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const currentTeam = this.teams.find(({ id }) => id === teamMember.teamId)

      if (currentTeam) {
        currentTeam.members.push({ ...teamMember, id: teamMember.userId })
        currentTeam.membersCount++
      }
    },

    async changeLeaderTeamMember(teamId: string, teamMember: TeamMember) {
      const { id: userId } = teamMember
      const response = await TeamService.appointLeaderTeam(teamId, teamMember)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const currentTeam = this.teams.find(({ id }) => id === teamId)
      const newLeader = currentTeam?.members.find(({ id }) => id === userId)

      if (currentTeam && newLeader) {
        currentTeam.leader = newLeader
      }
    },

    async kickTeamMember(teamId: string, teamMemberId: string) {
      const response = await TeamService.kickTeamMember(teamId, teamMemberId)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

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
    },

    async leaveFromTeam(teamId: string, teamMemberId: string) {
      const response = await TeamService.leaveFromTeam(teamId, teamMemberId)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

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
    },

    async deleteTeam(id: string) {
      const response = await TeamService.deleteTeam(id)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const deletingIdeaIndex = this.teams.findIndex((team) => team.id === id)

      if (deletingIdeaIndex !== -1) {
        this.teams.splice(deletingIdeaIndex, 1)
      }
    },
  },
})
