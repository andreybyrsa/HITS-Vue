import { defineStore } from 'pinia'

import ProjectService from '@Services/ProjectService'

import InitialState from '@Store/projects/initialState'
import { IdeaMarket } from '@Domain/IdeaMarket'

import useIdeasMarketStore from '@Store/ideasMarket/ideasMarket'

import { ProjectStatus } from '@Domain/Project'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import findOneAndUpdate from '@Utils/findOneAndUpdate'

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
      const response = await ProjectService.convertIdeaToProject(ideaMarket, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
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

        if (currentProject && currentProject.report) {
          currentProject.report.report = report
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
