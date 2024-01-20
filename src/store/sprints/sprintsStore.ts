import { defineStore } from 'pinia'

import SprintService from '@Services/SprintService'

import InitialState from '@Store/sprints/initialState'

const useSprintsStore = defineStore('sprints', {
  state: (): InitialState => ({
    sprints: [],
  }),

  getters: {
    getAllSprints() {
      return async (token: string) => {
        const response = await SprintService.getAllSprints(token)

        if (response instanceof Error) {
          return response
        }

        this.sprints = response
        return this.sprints
      }
    },
  },
})

export default useSprintsStore
