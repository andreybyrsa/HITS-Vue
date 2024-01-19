import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import { projectMocks } from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { Project } from '@Domain/Project'

const projectMocksAxios = defineAxios(projectMocks)

function formatGetMyProjects(projects: Project[], userId: string) {
  return projects.filter(
    (item) =>
      (item.initiator.id === userId ||
        item.team.members.find((member) => member.userId === userId) ||
        item.members.find((member) => member.userId === userId)) &&
      item.status === 'ACTIVE',
  )
}

// --- GET --- //
const getAllProjects = async (token: string): Promise<Project[] | Error> => {
  return projectMocksAxios
    .get('/ТУТ-БУДЕТ-ЧТО-ТО', {
      // FIX ROUTE
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения проектов'))
}

const getProject = async (id: string, token: string): Promise<Project | Error> => {
  return projectMocksAxios
    .get(
      '/ТУТ-БУДЕТ-ЧТО-ТО', // FIX ROUTE
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения проектов'))
}

const getMyProjects = async (
  userId: string,
  token: string,
): Promise<Project[] | Error> => {
  return projectMocksAxios
    .get<Project[]>(
      `/ТУТ-БУДЕТ-ЧТО-ТО/${userId}`,
      // FIX ROUTE
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (projects) => formatGetMyProjects(projects, userId),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения ваших проектов'))
}

// --- POST --- //
const convertIdeaToProject = async (
  project: Project,
  token: string,
): Promise<Project | Error> => {
  return projectMocksAxios
    .post(`/market/idea/convert`, project, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка конвертации идеи в проект'))
}

const ProfileService = {
  getAllProjects,
  getMyProjects,
  getProject,

  convertIdeaToProject,
}

export default ProfileService
