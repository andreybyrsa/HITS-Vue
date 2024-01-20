import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import { sprintMocks } from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { Sprint } from '@Domain/Project'

const sprintMocksAxios = defineAxios(sprintMocks)

// --- GET --- //
const getAllSprints = async (token: string): Promise<Sprint[] | Error> => {
  return sprintMocksAxios
    .get('/ТУТ-БУДЕТ-ЧТО-ТО', {
      // FIX ROUTE
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения спринтов'))
}

const ProfileService = {
  getAllSprints,
}

export default ProfileService
