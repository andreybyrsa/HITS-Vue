import { defineStore } from 'pinia'
import InitialState from './initialState'

import IdeasService from '@Services/IdeasService'

const useIdeasStore = defineStore('ideas', {
  state: (): InitialState => ({
    ideas: [],
  }),
  actions: {
    async fetchIdeas() {
      this.ideas = await IdeasService.fetchIdeas()
    },
  },
})

export default useIdeasStore
