import { defineStore } from 'pinia'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/questTemplates/initialState'
import QuestTemplatesService from '@Services/QuestTemplatesService'
import { QuestTemplate, QuestTemplateShort } from '@Domain/Quest'

const useQuestTemplatesStore = defineStore('questTemplatesStore', {
  state: (): InitialState => ({
    questTemplates: [],
    questTemplate: null,
  }),
  actions: {
    async getQuestTemplates(token: string): Promise<QuestTemplateShort[] | Error> {
      const response = await QuestTemplatesService.getQuestTemplates(token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }

      this.questTemplates = response
      return this.questTemplates
    },

    async getQuestTemplate(
      id: string,
      token: string,
    ): Promise<QuestTemplate | Error> {
      const response = await QuestTemplatesService.getQuestTemplate(id, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }

      this.questTemplate = response
      return this.questTemplate
    },

    async postQuestTemplate(
      quest: QuestTemplate,
      token: string,
    ): Promise<QuestTemplate | Error> {
      const response = await QuestTemplatesService.postQuestTemplate(quest, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return response
      }

      this.questTemplates.push(response)
      return response
    },
  },
})

export default useQuestTemplatesStore
