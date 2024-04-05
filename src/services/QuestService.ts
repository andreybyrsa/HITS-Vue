import { Quest, QuestShort } from '@Domain/Quest'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { questsShortMocks, questsMocks } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const questsShortAxios = defineAxios(questsShortMocks)
const questsLongAxios = defineAxios(questsMocks)

// --- GET --- //
const getQuests = async (token: string): Promise<QuestShort[] | Error> => {
  return questsShortAxios
    .get('/quests', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки запущенных опросов.'))
}

const getQuestsLong = async (token: string): Promise<Quest[] | Error> => {
  return questsLongAxios
    .get('/quests', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки запущенных опросов.'))
}

const QuestService = {
  getQuests,
  getQuestsLong,
}

export default QuestService
