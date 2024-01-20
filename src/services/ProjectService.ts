import useUserStore from '@Store/user/userStore'

import { API_URL, MODE } from '@Main'

import defineAxios from '@Utils/defineAxios'
import { projectMocks, teamsProjectsMocks } from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { Project, ProjectMember } from '@Domain/Project'
import { TeamMember } from '@Domain/Team'

const projectAxios = defineAxios(projectMocks)
const projectMembersAxios = defineAxios(teamsProjectsMocks)

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
  return projectAxios
    .get('/ТУТ-БУДЕТ-ЧТО-ТО', {
      // FIX ROUTE
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения проектов'))
}

const getProject = async (id: string, token: string): Promise<Project | Error> => {
  return projectAxios
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
  return projectAxios
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
  return projectAxios
    .post(`/market/idea/convert`, project, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка конвертации идеи в проект'))
}

const addProjectMember = async (
  projectMember: ProjectMember,
  projectId: string,
  token: string,
): Promise<ProjectMember | Error> => {
  if (MODE === 'DEVELOPMENT') {
    const projects = projectAxios.getReactiveMocks()

    projects.value.forEach((project) => {
      if (project.id === projectId) {
        project.members.push(projectMember)
      }
    })
  }

  return projectMembersAxios
    .postNoRequestBody<ProjectMember>(
      `/project/invite/${projectMember.teamId}/${projectMember.userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { requestData: projectMember },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления участника'))
}

const ProfileService = {
  getAllProjects,
  getMyProjects,
  getProject,

  convertIdeaToProject,
  addProjectMember,
}

export default ProfileService
