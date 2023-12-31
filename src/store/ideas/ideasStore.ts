import { defineStore } from 'pinia'
import InitialState from './initialState'

import { Idea, IdeaStatusType } from '@Domain/Idea'
import RolesTypes from '@Domain/Roles'

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
        const currentIdeaServiceKey =
          role === 'INITIATOR' ? 'getInitiatorIdeas' : 'getIdeas'

        const response = await IdeasService[currentIdeaServiceKey](token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }

        this.ideas = response
        return this.ideas
      }
    },

    getExpertNotConfirmedIdeas() {
      return async (token: string) => {
        const response = await IdeasService.getExpertNotConfirmedIdeas(token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }

        this.ideas = response
        return this.ideas
      }
    },

    getIdea() {
      return async (id: string, role: RolesTypes, token: string) => {
        const currentIdeaServiceKey =
          role === 'INITIATOR' ? 'getInitiatorIdea' : 'getIdea'

        const idea = await IdeasService[currentIdeaServiceKey](id, token)

        if (idea instanceof Error) {
          return idea
        }

        if (this.ideas.length) {
          return findOneAndUpdate(this.ideas, idea, { key: 'id', value: id })
        }

        const ideas = await this.getIdeas(role, token)

        if (ideas instanceof Error) {
          return ideas
        }

        return findOneAndUpdate(this.ideas, idea, { key: 'id', value: id })
      }
    },
  },
  actions: {
    async updateIdeaStatus(
      id: string,
      status: IdeaStatusType,
      role: RolesTypes,
      token: string,
    ) {
      const currentIdeaServiceKey =
        role === 'INITIATOR' ? 'sendIdeaOnApproval' : 'updateIdeaStatus'
      const response = await IdeasService[currentIdeaServiceKey](id, status, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentIdea = this.ideas.find((idea) => idea.id === id)

        if (currentIdea) {
          currentIdea.status = status
        }
      }
    },

    changeIdeasStatusOnMarket(merketIdeas: Idea[]) {
      merketIdeas.forEach((marketIdea) => {
        const ideaStore = this.ideas.find(({ id }) => id === marketIdea.id)

        if (ideaStore) {
          ideaStore.status = 'ON_MARKET'
        }
      })
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

    checkIdea(id: string) {
      const currentIdea = this.ideas.find((idea) => idea.id === id)

      if (currentIdea) currentIdea.isChecked = true
    },
  },
})

export default useIdeasStore
