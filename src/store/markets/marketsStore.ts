import { defineStore } from 'pinia'

import { Market, MarketStatus } from '@Domain/Market'

import MarketService from '@Services/MarketService'

import InitialState from '@Store/markets/initialState'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import findOneAndUpdate from '@Utils/findOneAndUpdate'

const useMarketsStore = defineStore('markets', {
  state: (): InitialState => ({
    markets: [],
  }),

  getters: {
    getAllMarkets() {
      return async (token: string) => {
        const response = await MarketService.getAllMarkets(token)

        if (response instanceof Error) {
          return response
        }

        this.markets = response
        return this.markets
      }
    },

    getIdea() {
      return async (id: string, token: string) => {
        const response = await MarketService.getMarket(id, token)

        if (response instanceof Error) {
          return response
        }

        return findOneAndUpdate(this.markets, response, { key: 'id', value: id })
      }
    },
  },

  actions: {
    async createMarket(market: Market, token: string) {
      const response = await MarketService.createMarket(market, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.markets.push(response)
      }
    },

    async updateMarket(market: Market, token: string) {
      const { id } = market
      const response = await MarketService.updateMarket(id, market, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentMarketIndex = this.markets.findIndex(
          (market) => market.id === id,
        )

        if (currentMarketIndex !== -1) {
          this.markets.splice(currentMarketIndex, 1, response)
        }
      }
    },

    async updateMarketStatus(id: string, marketStatus: MarketStatus, token: string) {
      const response = await MarketService.updateMarketStatus(
        id,
        marketStatus,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentStoreMarket = this.markets.find((market) => market.id === id)

        if (currentStoreMarket) {
          currentStoreMarket.status = marketStatus
        }
      }
    },

    async deleteMarket(id: string, token: string) {
      const response = await MarketService.deleteMarket(id, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentMarketIndex = this.markets.findIndex(
          (market) => market.id === id,
        )

        if (currentMarketIndex !== -1) {
          this.markets.splice(currentMarketIndex, 1)
        }
      }
    },
  },
})

export default useMarketsStore
