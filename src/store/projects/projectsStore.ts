import { defineStore } from 'pinia'

import ProjectService from '@Services/ProjectService'

import InitialState from '@Store/projects/initialState'

const useProjectsStore = defineStore('projects', {
  state: (): InitialState => ({
    projects: [],
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

        this.projects = response
        return this.projects
      }
    },
  },

  actions: {},
})

export default useProjectsStore
