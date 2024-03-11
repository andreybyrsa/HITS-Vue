import { defineStore } from 'pinia'
import { IdeaMarketAdvertisement } from '@Domain'
import { useNotification } from '@Hooks'
import { IdeaMarketService } from '@Service'

interface InitialState {
  ideaMarketAdvertisements: IdeaMarketAdvertisement[] | null
}

export const useIdeaMarketAdvertisementsStore = defineStore(
  'ideaMarketAdvertisements',
  {
    state: (): InitialState => ({
      ideaMarketAdvertisements: null,
    }),

    getters: {
      getIdeaMarketAdvertisements() {
        return async (ideaMarketId: string) => {
          this.ideaMarketAdvertisements = null

          const response = await IdeaMarketService.getIdeaMarketAdvertisements(
            ideaMarketId,
          )

          if (response instanceof Error) {
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
      ) {
        const response = await IdeaMarketService.postIdeaMarketAdvertisement(
          ideaMarketAdvertisement,
        )

        if (response instanceof Error) {
          useNotification('Система', response.message)
          return response
        }

        this.ideaMarketAdvertisements?.push(response)
      },

      async checkIdeaMarketAdvertisement(
        ideaMarketAdvertisement: IdeaMarketAdvertisement,
        email: string,
      ) {
        const { id, checkedBy } = ideaMarketAdvertisement
        const response = await IdeaMarketService.checkIdeaMarketAdvertisement({
          ...ideaMarketAdvertisement,
          checkedBy: [...checkedBy, email],
        })

        if (response instanceof Error) {
          useNotification('Система', response.message)
          return response
        }

        const currentAdvertisement = this.ideaMarketAdvertisements?.find(
          (advertisement) => advertisement.id === id,
        )

        if (currentAdvertisement) {
          currentAdvertisement.checkedBy.push(email)
        }
      },

      async deleteIdeaMarketAdvertisement(id: string) {
        const response = await IdeaMarketService.deleteIdeaMarketAdvertisement(id)

        if (response instanceof Error) {
          useNotification('Система', response.message)
          return response
        }

        const currentAdvertisementIndex = this.ideaMarketAdvertisements?.findIndex(
          (advertisement) => advertisement.id === id,
        )

        if (
          currentAdvertisementIndex !== undefined &&
          currentAdvertisementIndex !== -1
        ) {
          this.ideaMarketAdvertisements?.splice(currentAdvertisementIndex, 1)
        }
      },
    },
  },
)
