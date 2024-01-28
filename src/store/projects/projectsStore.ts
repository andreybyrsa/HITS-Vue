import { defineStore } from 'pinia'

import ProjectService from '@Services/ProjectService'

import InitialState from '@Store/projects/initialState'
import { IdeaMarket } from '@Domain/IdeaMarket'

import useIdeasMarketStore from '@Store/ideasMarket/ideasMarket'

import { Project, ProjectStatus } from '@Domain/Project'
import { Team } from '@Domain/Team'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import findOneAndUpdate from '@Utils/findOneAndUpdate'

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

    getProject() {
      return async (projectID: string, token: string) => {
        const response = await ProjectService.getProject(projectID, token)

        if (response instanceof Error) {
          return response
        }

        return findOneAndUpdate(this.projects, response, {
          key: 'id',
          value: projectID,
        })
      }
    },
  },

  actions: {
    async postProject(ideaMarket: IdeaMarket, token: string) {
      const { team, name, description, customer, initiator } = ideaMarket
      const currentDate = new Date().toJSON().toString()

      if (team) {
        const { members, name: teamName, id: teamId } = team

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
              projectName: name,
              teamId: teamId,
              teamName: teamName,
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

    async changeProjectStatus(
      projectId: string,
      status: ProjectStatus,
      token: string,
    ) {
      const response = await ProjectService.changeProjectStatus(
        projectId,
        status,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentProject = this.projects.find(({ id }) => id === projectId)
        if (currentProject) {
          currentProject.status = status
        }
      }
    },

    async reportProject(projectId: string, report: string, token: string) {
      const response = await ProjectService.reportProject(projectId, report, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentProject = this.projects.find(({ id }) => id === projectId)

        if (currentProject) {
          currentProject.report = report
        }
      }
    },

    async finishProject(projectId: string, finishDate: string, token: string) {
      const response = await ProjectService.finishProject(
        projectId,
        finishDate,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentProject = this.projects.find(({ id }) => id === projectId)

        if (currentProject) {
          currentProject.finishDate = finishDate
        }
      }
    },
  },
})

export default useProjectsStore
