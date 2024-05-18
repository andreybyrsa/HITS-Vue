import { QuestResult } from '@Domain/Quest'
import { QUEST_SERVICE_URL } from '@Main'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { resultsMocks } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const questResultsAxios = defineAxios(resultsMocks)

// --- GET --- //
const getQuestResults = async (
  idQuest: string,
  token: string,
): Promise<QuestResult[] | Error> => {
  return questResultsAxios
    .get(`${QUEST_SERVICE_URL}/quest/results/all`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      params: { idQuest },
    })
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка загрузки результатов опросов.'),
    )
}

const postQuestResults = async (
  questResults: QuestResult[],
  token: string,
): Promise<QuestResult[] | Error> => {
  return questResultsAxios
    .post(`${QUEST_SERVICE_URL}/quest/results`, questResults, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка отправки результата опроса.'))
}

const QuestResultService = {
  getQuestResults,
  postQuestResults,
}

export default QuestResultService
