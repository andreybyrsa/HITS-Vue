import { QuestResult, QuestResultWrapper } from '@Domain/Quest'
import { QUEST_SERVICE_URL } from '@Main'

import useUserStore from '@Store/user/userStore'

import getAbortedSignal from '@Utils/getAbortedSignal'

import handleAxiosError from '@Utils/handleAxiosError'
import axios, { AxiosError } from 'axios'

const postQuestResults = async (
  questResults: QuestResultWrapper,
  token: string,
): Promise<QuestResult[] | Error> => {
  return axios
    .post(`${QUEST_SERVICE_URL}/quest/results`, questResults, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка отправки результата опроса.'))
}

const downloadResults = async (
  idQuest: string,
  token: string,
): Promise<void | Error> => {
  try {
    const response = await axios.get(
      `${QUEST_SERVICE_URL}/quest/${idQuest}/results/download`,
      {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
    )
    if (!response) throw Error
    console.log('not error')

    // const contentDisposition = response.headers['content-disposition']
    const filename = `quest-${idQuest}-results`
    // if (contentDisposition) {
    //   const match = contentDisposition.match(/filename="?([^"]+)"?/)
    //   if (match && match[1]) {
    //     filename = match[1]
    //   }
    // }

    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    if (error instanceof AxiosError) {
      return handleAxiosError(error, 'Ошибка скачивания результата опроса.')
    }
  }
}

const QuestResultService = {
  // getQuestResults,
  postQuestResults,
  downloadResults,
}

export default QuestResultService
