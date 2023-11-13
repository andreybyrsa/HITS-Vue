import { defineStore } from 'pinia'
import InitialState from './initialState'

import RolesTypes from '@Domain/Roles'
import IdeaStatusTypes from '@Domain/IdeaStatus'

import IdeasService from '@Services/IdeasService'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import findOneAndUpdate from '@Utils/findOneAndUpdate'

const useIdeasStore = defineStore('ideas', {
  state: (): InitialState => ({
    ideas: [],
  }),
  getters: {
    getIdeas() {
      return async (role: RolesTypes, token: string) => {
        if (role === 'INITIATOR') {
          const response = await IdeasService.getInitiatorIdeas(token)

          if (response instanceof Error) {
            return response
          }

          this.ideas = response
          return this.ideas
        } else {
          const response = await IdeasService.getIdeas(token)

          if (response instanceof Error) {
            return response
          }

          this.ideas = response
          return this.ideas
        }
      }
    },

    getIdea() {
      return async (id: string, role: RolesTypes, token: string) => {
        const idea = await IdeasService.getIdea(id, token)

        if (idea instanceof Error) {
          useNotificationsStore().createSystemNotification('Система', idea.message)
          return idea
        }

        if (this.ideas.length) {
          return findOneAndUpdate(this.ideas, idea, { key: 'id', value: id })
        }

        const ideas = await this.getIdeas(role, token)

        if (ideas instanceof Error) {
          useNotificationsStore().createSystemNotification('Система', ideas.message)
          return ideas
        }

        return findOneAndUpdate(this.ideas, idea, { key: 'id', value: id })
      }
    },
  },
  actions: {
    async updateIdeaStatus(id: string, status: IdeaStatusTypes, token: string) {
      const response = await IdeasService.updateIdeaStatus(id, status, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentIdea = this.ideas.find((idea) => idea.id === id)

        if (currentIdea) {
          currentIdea.status = status
        }
      }
    },

    setIdeaRating(id: string, rating: number) {
      const currentIdea = this.ideas.find((idea) => idea.id === id)

      if (currentIdea) {
        currentIdea.rating = rating
        currentIdea.status = 'CONFIRMED'
      }
    },

    async deleteIdea(id: string, token: string) {
      const response = await IdeasService.deleteIdea(id, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const deletingIdeaIndex = this.ideas.findIndex((idea) => idea.id === id)

        if (deletingIdeaIndex !== -1) {
          this.ideas.splice(deletingIdeaIndex, 1)
        }
      }
    },
  },
})

export default useIdeasStore
