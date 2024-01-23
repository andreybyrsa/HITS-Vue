import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import { sprintMocks } from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { Sprint } from '@Domain/Project'

const sprintMocksAxios = defineAxios(sprintMocks)

function formatterAllSprintsProject(sprints: Sprint[], currentProjectId: string) {
  return sprints.filter(({ projectId }) => projectId === currentProjectId)
}

// --- GET --- //
const getAllSprintsProject = async (
  projectId: string,
  token: string,
): Promise<Sprint[] | Error> => {
  return sprintMocksAxios
    .get<Sprint[]>(
      '/ТУТ-БУДЕТ-ЧТО-ТО',
      {
        // FIX ROUTE
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (sprints) => formatterAllSprintsProject(sprints, projectId),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения спринтов'))
}

const ProfileService = {
  getAllSprintsProject,
}

export default ProfileService
