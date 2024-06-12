import { QuestTemplate, QuestTemplateShort } from '@Domain/Quest'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { QuestsTemplateMocks, questsShortMocks } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const questsShortAxios = defineAxios(questsShortMocks)
const questAxios = defineAxios(QuestsTemplateMocks)

// --- GET --- //
const getQuestTemplates = async (
  token: string,
): Promise<QuestTemplateShort[] | Error> => {
  return questsShortAxios
    .get(`/quest-service/template/all`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки опросов.'))
}

const getQuestTemplate = async (
  idQuestTemplate: string,
  token: string,
): Promise<QuestTemplate | Error> => {
  return questAxios
    .get(
      `/quest-service/template/with-indicators/${idQuestTemplate}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { idQuestTemplate } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения опроса.'))
}

const postQuestTemplate = async (
  quest: QuestTemplate,
  token: string,
): Promise<QuestTemplate | Error> => {
  return questAxios
    .post(`/quest-service/template/create`, quest, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка отправки опроса.'))
}

const QuestTemplatesService = {
  getQuestTemplates,
  getQuestTemplate,
  postQuestTemplate,
}

export default QuestTemplatesService
