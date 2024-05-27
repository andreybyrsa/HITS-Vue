import { Quest, QuestStat } from '@Domain/Quest'
import { QUEST_SERVICE_URL } from '@Main'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { QuestsMocks, QuestStatMocks } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const launchQuestAxios = defineAxios(QuestsMocks)
const launchQuestCollapseAxios = defineAxios(QuestStatMocks)

// --- GET --- //
const getQuests = async (token: string): Promise<Quest[] | Error> => {
  return launchQuestAxios
    .get(`${QUEST_SERVICE_URL}/quest/all`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки запущенных опросов.'))
}
const getQuestsCollapseData = async (token: string) => {
  return launchQuestCollapseAxios
    .get(`${QUEST_SERVICE_URL}/quest/stats/all`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки данных опроса'))
}

const postQuest = async (
  launchQuest: Quest,
  token: string,
): Promise<Quest | Error> => {
  return launchQuestAxios
    .post(`${QUEST_SERVICE_URL}/launch-quest`, launchQuest, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка отправки запущенного опроса.'))
}

const sendNotifications = async (idQuest: string, token: string) => {
  return launchQuestAxios
    .postNoRequestBody(
      `${QUEST_SERVICE_URL}/quest/notifications/${idQuest}/send`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {},
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка отправки напоминаний об опросе.'),
    )
}

const LaunchQuestService = {
  getQuests,
  getQuestsCollapseData,
  postQuest,
  sendNotifications,
}

export default LaunchQuestService
