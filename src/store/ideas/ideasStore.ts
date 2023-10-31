import { defineStore } from 'pinia'
import InitialState from './initialState'

import IdeaStatusTypes from '@Domain/IdeaStatus'

import IdeasService from '@Services/IdeasService'
import { Idea } from '@Domain/Idea'

const useIdeasStore = defineStore('ideas', {
  state: (): InitialState => ({
    ideas: null,
  }),
  getters: {
    getIdea() {
      return async (id: number, token: string) => {
        // await IdeasService.getIdea(id, token)
        //   .then((response) => updateItemList(this.ideas, response.data))
        //   .catch(({ response }) => {
        //     const error = response?.data?.error ?? 'Ошибка загрузки идеи'
        //     return new Error(error)
        //   })

        // function updateItemList<T extends { id: number }>(
        //   list: T[] | null,
        //   item: T,
        // ) {
        //   if (list) {
        //     const existingIdeaIndex = list.findIndex((l) => l.id === item.id)

        //     if (existingIdeaIndex !== -1) {
        //       list.splice(existingIdeaIndex, 1, item)
        //     }

        //     return list[existingIdeaIndex]
        //   }
        // }

        const response = await IdeasService.getIdea(id, token)

        if (response instanceof Error) {
          // notification
          return response
        }

        if (this.ideas) {
          const existingIdeaIndex = this.ideas.findIndex((idea) => idea.id === id)

          if (existingIdeaIndex !== -1) {
            this.ideas.splice(existingIdeaIndex, 1, response)
          }

          return this.ideas[existingIdeaIndex]
        }

        return response
      }
    },
  },
  actions: {
    async fetchIdeas(token: string) {
      const response = await IdeasService.getIdeas(token)

      if (response instanceof Error) {
        // notification
      } else {
        this.ideas = response
      }
    },

    async deleteIdea(id: number, token: string) {
      const response = await IdeasService.deleteIdea(id, token)

      if (response instanceof Error) {
        // notification
      } else if (this.ideas) {
        this.ideas = this.ideas.filter((idea) => idea.id !== id)
      }
    },

    async sendIdeaOnApproval(id: number, token: string) {
      const response = await IdeasService.sendIdeaOnApproval(id, token)

      if (response instanceof Error) {
        // notification
      } else if (this.ideas) {
        const currentIdea = this.ideas.find((idea) => idea.id === id)

        if (currentIdea) {
          currentIdea.status = 'ON_APPROVAL'
        }
      }
    },

    async updateIdeaStatusByProjectOffice(
      id: number,
      status: IdeaStatusTypes,
      token: string,
    ) {
      const response = await IdeasService.updateIdeaStatusByProjectOffice(
        id,
        status,
        token,
      )

      if (response instanceof Error) {
        // notification
      } else if (this.ideas) {
        const currentIdea = this.ideas.find((idea) => idea.id === id)

        if (currentIdea) {
          currentIdea.status = status
        }
      }
    },
  },
})
export default useIdeasStore
