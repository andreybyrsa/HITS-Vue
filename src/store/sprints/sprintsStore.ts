import { defineStore } from 'pinia'

import SprintService from '@Services/SprintService'

import InitialState from '@Store/sprints/initialState'

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
})

export default useSprintsStore
