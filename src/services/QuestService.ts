import { Quest, QuestCollapseData } from '@Domain/Quest'
import { QUEST_SERVICE_URL } from '@Main'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { launchQuestsMocks, questCollapseData } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const launchQuestAxios = defineAxios(launchQuestsMocks)
const launchQuestCollapseAxios = defineAxios(questCollapseData)

function formatTeamInvitationsByTeamId(
  quests: QuestCollapseData[],
  idQuest: string,
) {
  return quests.filter((quest) => quest.idQuest === idQuest)
}

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
const getQuestsCollapseData = async (token: string, idQuest: string) => {
  return launchQuestCollapseAxios
    .get(
      `${QUEST_SERVICE_URL}/quest/collapse/${idQuest}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (invitations) =>
          formatTeamInvitationsByTeamId(invitations, idQuest),
      },
    )
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

const LaunchQuestService = {
  getQuests,
  getQuestsCollapseData,
  postQuest,
}

export default LaunchQuestService
