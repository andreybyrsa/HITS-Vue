import { defineStore } from 'pinia'

import ProjectService from '@Services/ProjectService'

import InitialState from '@Store/projects/initialState'
import { IdeaMarket } from '@Domain/IdeaMarket'

import useIdeasMarketStore from '@Store/ideasMarket/ideasMarket'

import { Project } from '@Domain/Project'
import { Team } from '@Domain/Team'
import useNotificationsStore from '@Store/notifications/notificationsStore'

function getMemberRole(userId: string, team: Team, ideaMarket: IdeaMarket) {
  if (team.leader?.userId === userId) {
    return 'TEAM_LEADER'
  }
  if (ideaMarket.initiator.id === userId) {
    return 'MEMBER'
  }
  return 'INITIATOR'
}

const useProjectsStore = defineStore('projects', {
  state: (): InitialState => ({
    projects: [],
    myActiveProjects: [],
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

        this.myActiveProjects = response
        return this.myActiveProjects
      }
    },
  },

  actions: {
    async postProject(ideaMarket: IdeaMarket, token: string) {
      const { team, name, description, customer, initiator } = ideaMarket
      const currentDate = new Date().toJSON().toString()

      if (team) {
        const { members } = team

        const project: Project = {
          id: '',
          name: name,
          description: description,
          customer: customer,
          initiator: initiator,
          team: team,
          members: members.map(({ userId, email, firstName, lastName }) => {
            const currentDate = new Date().toJSON().toString()
            return {
              userId: userId,
              email: email,
              firstName: firstName,
              lastName: lastName,
              startDate: currentDate,
              finishDate: '',
              projectRole: getMemberRole(userId, team, ideaMarket),
            }
          }),
          logs: [],
          report: '',
          startDate: currentDate,
          finishDate: '',
          status: 'ACTIVE',
        }

        const response = await ProjectService.convertIdeaToProject(project, token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
        } else {
          this.projects?.push(response)

          const ideaMarketsStore = useIdeasMarketStore()
          const currentIdeaMarket = ideaMarketsStore.ideasMarket.find(
            (ideaFromMarket) => ideaFromMarket.id === ideaMarket.id,
          )

          if (currentIdeaMarket) {
            const { id } = currentIdeaMarket
            await ideaMarketsStore.updateIdeaMarketStatus(id, 'PROJECT', token)
          }
        }
      }
    },
  },
})

export default useProjectsStore
