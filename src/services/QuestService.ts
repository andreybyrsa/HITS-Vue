import { Quest, QuestShort } from '@Domain/Quest'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { questsMocks, questsShortMocks } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const questsShortAxios = defineAxios(questsShortMocks)
const questAxios = defineAxios(questsMocks)

// --- GET --- //
const getQuests = async (token: string): Promise<QuestShort[] | Error> => {
  return questsShortAxios
    .get('/quests', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки опросов.'))
}

const getQuest = async (idQuest: string, token: string): Promise<Quest | Error> => {
  return questAxios
    .get(
      `/quest/${idQuest}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { idQuest } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения опроса.'))
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
<<<<<<< HEAD
  getQuestsLong,
=======
  getQuest,
>>>>>>> f84baac5ac19e286d1422a07e4be88485e60443e
}

export default QuestService
