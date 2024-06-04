import { defineStore } from 'pinia'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/questResults/initialState'
import { QuestResult, QuestResultWrapper } from '@Domain/Quest'
import QuestResultService from '@Services/QuestResultService'

const useQuestResultsStore = defineStore('questResultsStore', {
  state: (): InitialState => ({
    questResults: [],
  }),
  actions: {
    async postQuestResults(
      questResults: QuestResultWrapper,
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

    async downloadResults(idQuest: string, token: string): Promise<void | Error> {
      const response = await QuestResultService.downloadResults(idQuest, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }
    },
  },
})

export default useQuestResultsStore
