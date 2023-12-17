import { defineStore } from 'pinia'

import { IdeaMarketAdvertisement } from '@Domain/IdeaMarket'

import IdeasMarketService from '@Services/IdeasMarketService'

import InitialState from '@Store/ideaMarketAdvertisements/initialState'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const useIdeaMarketAdvertisementsStore = defineStore('ideaMarketAdvertisements', {
  state: (): InitialState => ({
    ideaMarketAdvertisements: null,
  }),

  getters: {
    getIdeaMarketAdvertisements() {
      return async (ideaMarketId: string, token: string) => {
        this.ideaMarketAdvertisements = null

        const response = await IdeasMarketService.getIdeaMarketAdvertisements(
          ideaMarketId,
          token,
        )

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }

        this.ideaMarketAdvertisements = response
        return this.ideaMarketAdvertisements
      }
    },
  },

  actions: {
    async postIdeaMarketAdvertisement(
      ideaMarketAdvertisement: IdeaMarketAdvertisement,
      token: string,
    ) {
      const response = await IdeasMarketService.postIdeaMarketAdvertisement(
        ideaMarketAdvertisement,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.ideaMarketAdvertisements?.push(response)
      }
    },

    async checkIdeaMarketAdvertisement(
      ideaMarketAdvertisement: IdeaMarketAdvertisement,
      email: string,
      token: string,
    ) {
      const { id, checkedBy } = ideaMarketAdvertisement
      const response = await IdeasMarketService.checkIdeaMarketAdvertisement(
        { ...ideaMarketAdvertisement, checkedBy: [...checkedBy, email] },
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentAdvertisement = this.ideaMarketAdvertisements?.find(
          (advertisement) => advertisement.id === id,
        )

        if (currentAdvertisement) {
          currentAdvertisement.checkedBy.push(email)
        }
      }
    },

    async deleteIdeaMarketAdvertisement(id: string, token: string) {
      const response = await IdeasMarketService.deleteIdeaMarketAdvertisement(
        id,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentAdvertisementIndex = this.ideaMarketAdvertisements?.findIndex(
          (advertisement) => advertisement.id === id,
        )

        if (
          currentAdvertisementIndex !== undefined &&
          currentAdvertisementIndex !== -1
        ) {
          this.ideaMarketAdvertisements?.splice(currentAdvertisementIndex, 1)
        }
      }
    },
  },
})

export default useIdeaMarketAdvertisementsStore
