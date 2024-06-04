import { Quest, QuestStat } from '@Domain/Quest'
import { QUEST_SERVICE_URL } from '@Main'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { QuestsMocks, QuestStatMocks } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const launchQuestAxios = defineAxios(QuestsMocks)
const launchQuestCollapseAxios = defineAxios(QuestStatMocks)

const filterQuests = () => {
  return QuestStatMocks.slice(0, 4)
}

// --- GET --- //
const getQuestsForProjectOffice = async (
  token: string,
): Promise<QuestStat[] | Error> => {
  return launchQuestCollapseAxios
    .get<QuestStat[]>(
      `${QUEST_SERVICE_URL}/quest/all/with-statuses`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { formatter: () => filterQuests() },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки запущенных опросов.'))
}

const getQuests = async (
  idUser: string,
  token: string,
): Promise<QuestStat[] | Error> => {
  return launchQuestCollapseAxios
    .get(`${QUEST_SERVICE_URL}/quest/by-user/with-statuses/${idUser}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки запущенных опросов.'))
}

const postQuest = async (
  launchQuest: Quest,
  token: string,
): Promise<Quest | Error> => {
  return launchQuestAxios
    .post(`${QUEST_SERVICE_URL}/quest/create`, launchQuest, {
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
  getQuestsForProjectOffice,
  postQuest,
  sendNotifications,
}

export default LaunchQuestService
