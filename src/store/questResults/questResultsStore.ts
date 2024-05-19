import { defineStore } from 'pinia'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/questResults/initialState'
import { QuestResult } from '@Domain/Quest'
import QuestResultService from '@Services/QuestResultService'

const useQuestResultsStore = defineStore('questResultsStore', {
  state: (): InitialState => ({
    questResults: [],
  }),
  actions: {
    async postQuestResults(
      questResults: QuestResult[],
      token: string,
    ): Promise<QuestResult[] | Error> {
      const response = await QuestResultService.postQuestResults(questResults, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }

      this.questResults.push(...response)
      return response
    },

    // этот метод возвращает csv файл и поэтому не использует состояния стора
    async getQuestResults(
      idQuest: string,
      token: string,
    ): Promise<QuestResult[] | Error> {
      const response = await QuestResultService.getQuestResults(idQuest, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }

      return response
    },
  },
})

export default useQuestResultsStore
