import { defineStore } from 'pinia'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/indicators/initialState'
import IndicatorService from '@Services/IndicatorService'
import { Indicator } from '@Domain/Quest'

const useIndicatorStore = defineStore('indicatorsStore', {
  state: (): InitialState => ({
    indicators: [],
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

    async postIndicator(indicator: Indicator, token: string) {
      const response = await IndicatorService.postIndicator(indicator, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }

      this.indicators.push(indicator)

      return
    },
  },
})

export default useIndicatorStore
