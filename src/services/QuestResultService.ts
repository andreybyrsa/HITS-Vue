import { QuestResult } from '@Domain/Quest'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { resultsMocks } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const questResultsAxios = defineAxios(resultsMocks)

// --- GET --- //
const getQuestResults = async (token: string): Promise<QuestResult[] | Error> => {
  return questResultsAxios
    .get('/quest-results', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
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
    .post(`/quest-result`, questResults, {
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
