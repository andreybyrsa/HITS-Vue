import { defineStore } from 'pinia'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/quests/initialState'
import QuestService from '@Services/QuestService'
import { Quest } from '@Domain/Quest'

const useQuestsStore = defineStore('questsStore', {
  state: (): InitialState => ({
    quests: [],
    questsColapseData: [],
  }),
  getters: {
    getQuestsForProjectOffice() {
      return async (token: string) => {
        const response = await QuestService.getQuestsForProjectOffice(token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }

        this.quests = response
        return this.quests
      }
    },
    getQuests() {
      return async (idUser: string, token: string) => {
        const response = await QuestService.getQuests(idUser, token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }

        this.quests = response
        return this.quests
      }
    },
    getQuestCollapseData() {
      return async (token: string) => {
        const response = await QuestService.getQuestsCollapseData(token)
        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )

          return response
        }

        this.questsColapseData = response
        return this.questsColapseData
      }
    },
  },
  actions: {
    async postQuest(launchQuest: Quest, token: string) {
      const response = await QuestService.postQuest(launchQuest, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }

      return this.quests
    },
    async sendNotifications(idQuest: string, token: string) {
      const response = await QuestService.sendNotifications(idQuest, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }
    },
  },
})

export default useQuestsStore
