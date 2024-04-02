import { LaunchQuest } from '@Domain/Quest'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { launchQuestsMocks } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const launchQuestAxios = defineAxios(launchQuestsMocks)

// --- GET --- //
const getLaunchQuests = async (token: string): Promise<LaunchQuest[] | Error> => {
  return launchQuestAxios
    .get('/launch-quests', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки запущенных опросов.'))
}

const LaunchQuestService = {
  getLaunchQuests,
}

export default LaunchQuestService
