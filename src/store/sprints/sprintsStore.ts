import { defineStore } from 'pinia'

import SprintService from '@Services/SprintService'

import InitialState from '@Store/sprints/initialState'
import { SprintStatus } from '@Domain/Project'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const useSprintsStore = defineStore('sprints', {
  state: (): InitialState => ({
    sprints: [],
    activeSprint: undefined,
  }),

  getters: {
    getAllSprints() {
      return async (projectId: string, token: string) => {
        const response = await SprintService.getAllSprintsProject(projectId, token)

        if (response instanceof Error) {
          return response
        }

        this.sprints = response
        return this.sprints
      }
    },

    getActiveSprint() {
      return async (projectId: string, token: string) => {
        const response = await SprintService.getActiveSprintsProject(
          projectId,
          token,
        )

        if (response instanceof Error) {
          return response
        }

        this.activeSprint = response
        return this.activeSprint
      }
    },
  },

  actions: {
    async changeSprintStatus(sprintId: string, status: SprintStatus, token: string) {
      const response = await SprintService.changeSprintStatus(
        sprintId,
        status,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentSprint = this.sprints.find(({ id }) => id === sprintId)
        if (currentSprint) {
          currentSprint.status = status
        }
      }
    },

    async reportSprint(sprintId: string, report: string, token: string) {
      const response = await SprintService.reportSprint(sprintId, report, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentSprint = this.sprints.find(({ id }) => id === sprintId)

        if (currentSprint) {
          currentSprint.report = report
        }
      }
    },

    async finishSprint(sprintId: string, finishDate: string, token: string) {
      const response = await SprintService.finishSprintDate(
        sprintId,
        finishDate,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentSprint = this.sprints.find(({ id }) => id === sprintId)

        if (currentSprint) {
          currentSprint.finishDate = finishDate
        }
      }
    },

    async saveMarkSprint(sprintId: string, mark: number, token: string) {
      const response = await SprintService.saveMarkSprint(sprintId, mark, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentSprint = this.sprints.find(({ id }) => id === sprintId)

        if (currentSprint && currentSprint.marks) {
          currentSprint.marks.mark = mark
        }
      }
    },
  },
})

export default useSprintsStore
