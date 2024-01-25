import { defineStore } from 'pinia'

import TagsService from '@Services/TagsService'

import InitialState from '@Store/tags/initialState'

const useTagsStore = defineStore('tags', {
  state: (): InitialState => ({
    tags: [],
  }),

  getters: {
    getAllTags() {
      return async (token: string) => {
        const response = await TagsService.getAllTags(token)

        if (response instanceof Error) {
          return response
        }

        this.tags = response
        return this.tags
      }
    },
  },
})

export default useTagsStore
