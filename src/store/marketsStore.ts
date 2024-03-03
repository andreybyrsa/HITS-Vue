import { defineStore } from 'pinia'
import { Market, MarketStatus } from '@Domain'
import { useNotification } from '@Hooks'
import { MarketService } from '@Service'
import { findOneAndUpdate } from '@Utils'

interface InitialState {
  markets: Market[]
}

export const useMarketsStore = defineStore('markets', {
  state: (): InitialState => ({
    markets: [],
  }),

  getters: {
    getAllMarkets() {
      return async () => {
        const response = await MarketService.getAllMarkets()

        if (response instanceof Error) {
          return response
        }

        this.markets = response
        return this.markets
      }
    },

    getIdea() {
      return async (id: string) => {
        const response = await MarketService.getMarket(id)

        if (response instanceof Error) {
          return response
        }

        return findOneAndUpdate(this.markets, response, { key: 'id', value: id })
      }
    },
  },

  actions: {
    async createMarket(market: Market) {
      const response = await MarketService.createMarket(market)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      this.markets.push(response)
    },

    async updateMarket(market: Market) {
      const { id } = market
      const response = await MarketService.updateMarket(id, market)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const currentMarketIndex = this.markets.findIndex((market) => market.id === id)

      if (currentMarketIndex !== -1) {
        this.markets.splice(currentMarketIndex, 1, response)
      }
    },

    async updateMarketStatus(id: string, marketStatus: MarketStatus) {
      const response = await MarketService.updateMarketStatus(id, marketStatus)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }
      const currentStoreMarket = this.markets.find((market) => market.id === id)

      if (currentStoreMarket) {
        currentStoreMarket.status = marketStatus
      }
    },

    async deleteMarket(id: string) {
      const response = await MarketService.deleteMarket(id)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const currentMarketIndex = this.markets.findIndex((market) => market.id === id)

      if (currentMarketIndex !== -1) {
        this.markets.splice(currentMarketIndex, 1)
      }
    },
  },
})
