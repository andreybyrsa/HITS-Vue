import { LaunchQuest } from '@Domain/Quest'
import { QUEST_SERVICE_URL } from '@Main'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { launchQuestsMocks } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const launchQuestAxios = defineAxios(launchQuestsMocks)

// --- GET --- //
const getLaunchQuests = async (token: string): Promise<LaunchQuest[] | Error> => {
  return launchQuestAxios
    .get(`${QUEST_SERVICE_URL}/quest/all`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки запущенных опросов.'))
}

const postLaunchQuest = async (
  launchQuest: LaunchQuest,
  token: string,
): Promise<LaunchQuest | Error> => {
  return launchQuestAxios
    .post(`${QUEST_SERVICE_URL}/quest/create`, launchQuest, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка отправки запущенного опроса.'))
}

const LaunchQuestService = {
  getLaunchQuests,
  postLaunchQuest,
}

export default LaunchQuestService
