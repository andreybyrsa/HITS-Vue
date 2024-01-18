import { defineStore } from 'pinia'

import { IdeaMarket } from '@Domain/IdeaMarket'
import { Team, TeamMember } from '@Domain/Team'

import ProjectService from '@Services/ProjectService'
import IdeasMarketService from '@Services/IdeasMarketService'

import InitialState from '@Store/projects/initialState'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import { Project } from '@Domain/Project'

const useProjectsStore = defineStore('projects', {
  state: (): InitialState => ({
    project: null,
    projects: [],
    myProjects: [],
  }),

  getters: {
    getAllProjects() {
      return async (token: string) => {
        const response = await ProjectService.getAllProjects(token)

        if (response instanceof Error) {
          return response
        }

        this.projects = response
        return this.projects
      }
    },

    getMyProjects() {
      return async (userId: string, token: string) => {
        const response = await ProjectService.getMyProjects(userId, token)

        if (response instanceof Error) {
          return response
        }

        this.myProjects = response
        return this.myProjects
      }
    },
  },

  actions: {
    async postProject(
      marketId: string,
      ideaMarket: IdeaMarket,
      token: string,
      team: Team,
      teamMember: TeamMember[],
    ) {
      if (ideaMarket.team !== null) {
        const project: Project = {
          id: '',
          name: ideaMarket.name,
          description: ideaMarket.description,
          customer: ideaMarket.customer,
          initiator: ideaMarket.initiator,
          team: ideaMarket.team,
          members: teamMember.map((member) => {
            return {
              projectId: '3456789087654345678',
              projectName: ideaMarket.name,
              teamId: member.teamId,
              teamName: team.name,
              userId: member.userId,
              email: member.email,
              firstName: member.firstName,
              lastName: member.lastName,
              startDate: new Date().toJSON().toString(),
              finishDate: '',
              role: 'DEVELOPER',
            }
          }),

          startDate: new Date().toJSON().toString(),
          finishDate: '',
          status: 'ACTIVE',
        }
        const response = await IdeasMarketService.convertIdeaToProject(
          project,
          token,
          marketId,
        )

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
        } else {
          this.projects?.push(response)
        }
      }
    },
  },
})

export default useProjectsStore
