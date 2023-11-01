import { defineStore } from 'pinia'
import InitialState from './initialState'

import RolesTypes from '@Domain/Roles'
import IdeaStatusTypes from '@Domain/IdeaStatus'

import IdeasService from '@Services/IdeasService'

import useNotificationsStore from '@Store/notifications/notificationsStore'

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
            return useNotificationsStore().createSystemNotification(
              'Система',
              response.message,
            )
          }

          this.ideas = response
          return this.ideas
        } else {
          const response = await IdeasService.getIdeas(token)

          if (response instanceof Error) {
            return useNotificationsStore().createSystemNotification(
              'Система',
              response.message,
            )
          }

          this.ideas = response
          return this.ideas
        }
      }
    },

    getIdea() {
      return async (id: number, token: string) => {
        const response = await IdeasService.getIdea(id, token)

        if (response instanceof Error) {
          return useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
        }

        const existingIdeaIndex = this.ideas.findIndex((idea) => idea.id === id)

        if (existingIdeaIndex !== -1) {
          this.ideas.splice(existingIdeaIndex, 1, response)
        }

        return this.ideas[existingIdeaIndex]
      }
    },
  },
  actions: {
    async sendIdeaOnApproval(id: number, token: string) {
      const response = await IdeasService.sendIdeaOnApproval(id, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
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
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentIdea = this.ideas.find((idea) => idea.id === id)

        if (currentIdea) {
          currentIdea.status = status
        }
      }
    },

    async deleteIdea(id: number, token: string) {
      const response = await IdeasService.deleteIdea(id, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.ideas = this.ideas.filter((idea) => idea.id !== id)
      }
    },
  },
})

export default useIdeasStore
