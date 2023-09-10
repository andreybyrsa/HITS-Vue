import { defineStore } from 'pinia'
import InitialState from './initialState'
import { Idea } from '@Domain/Idea'
import IdeasService from '@Services/IdeasService'

const useIdeasStore = defineStore('ideas', {
  state: (): InitialState => ({
    ideas: [],
    initiatorIdeas: [],
  }),
  actions: {
    async sendInitiatorIdeaOnApproval(id: string, token: string) {
      const idea: Idea[] = await IdeasService.fetchIdeas(token)
      const currentIdea = await idea.find((e: Idea) => e.id == id)
    },
  },
})

export default useIdeasStore
