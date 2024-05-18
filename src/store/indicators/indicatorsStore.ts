import { defineStore } from 'pinia'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/indicators/initialState'
import IndicatorService from '@Services/IndicatorService'
import { Indicator, IndicatorCategory } from '@Domain/Quest'

const useIndicatorStore = defineStore('indicatorsStore', {
  state: (): InitialState => ({
    indicators: [],
    indicatorCategories: [],
  }),
  actions: {
    async getIndicators(token: string): Promise<Indicator[] | Error> {
      const response = await IndicatorService.getIndicators(token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }

      this.indicators = response
      return this.indicators
    },

    async postIndicator(token: string, indicator: Indicator) {
      const response = await IndicatorService.postIndicator(indicator, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }

      this.indicators.push(response)

      return response
    },

    async getIndicatorCategories(
      token: string,
    ): Promise<IndicatorCategory[] | Error> {
      const response = await IndicatorService.getIndicatorCategories(token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }

      this.indicatorCategories = response
      return this.indicatorCategories
    },

    async postIndicatorCategory(
      token: string,
      indicatorCategory: IndicatorCategory,
    ) {
      const response = await IndicatorService.postIndicatorCategory(
        indicatorCategory,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }

      this.indicatorCategories.push(response)

      return response
    },
  },
})

export default useIndicatorStore
