import { defineStore } from 'pinia'
import InitialState from './initialState'

const useIdeasStore = defineStore('ideas', {
  state: (): InitialState => ({
    ideas: [],
    initiatorIdeas: [],
  }),
  actions: {},
})

export default useIdeasStore
