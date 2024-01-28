import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import { averageMarkMocks, projectMocks } from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { Project, ProjectStatus } from '@Domain/Project'
import { AverageMark } from '@Domain/ReportProjectMembers'
import Success from '@Domain/ResponseMessage'
import axios from 'axios'
import { MODE } from '@Main'

const projectMocksAxios = defineAxios(projectMocks)
const averageMarkMocksAxios = defineAxios(averageMarkMocks)

function formatGetMyProjects(projects: Project[], userId: string) {
  return projects.filter(
    (item) =>
      (item.initiator.id === userId ||
        item.team.members.find((member) => member.userId === userId) ||
        item.members.find((member) => member.userId === userId)) &&
      item.status === 'ACTIVE',
  )
}

function formatGetAverageMarkProject(
  averageMarkMocks: AverageMark[],
  projectId: string,
) {
  return averageMarkMocks.filter((mark) => mark.projectId === projectId)
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

const getAverageMarkProject = async (
  projectId: string,
  token: string,
): Promise<AverageMark[] | Error> => {
  return averageMarkMocksAxios
    .get<AverageMark[]>(
      '/mark', // FIX ROUTE
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (averageMark) =>
          formatGetAverageMarkProject(averageMark, projectId),
      },
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка получения средней оценки за проект'),
    )
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

// --- PUT --- //
const changeProjectStatus = async (
  projectId: string,
  status: ProjectStatus,
  token: string,
): Promise<Success | Error> => {
  return projectMocksAxios
    .putNoRequestBody<Success>(
      `/project/status/change/${projectId}/${status}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        params: { id: projectId },
        requestData: { status: status },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса проекта'))
}

const reportProject = async (
  projectId: string,
  report: string,
  token: string,
): Promise<Success | Error> => {
  if (MODE === 'DEVELOPMENT') {
    return projectMocksAxios
      .putNoRequestBody<Success>(
        `/project/report/change/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
        },
        {
          params: { id: projectId },
          requestData: { report: report },
        },
      )
      .then((response) => response.data)
      .catch((error) => handleAxiosError(error, 'Ошибка заполнения отчета проекта'))
  }
  return axios
    .put<Success>(`/project/report/change/${projectId}`, report, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка заполнения отчета проекта'))
}

const finishProject = async (
  projectId: string,
  finishDate: string,
  token: string,
): Promise<Success | Error> => {
  if (MODE === 'DEVELOPMENT') {
    return projectMocksAxios
      .putNoRequestBody<Success>(
        `/project/finish/change/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
        },
        {
          params: { id: projectId },
          requestData: { finishDate: finishDate },
        },
      )
      .then((response) => response.data)
      .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса проекта'))
  }
  return axios
    .put<Success>(`/project/finish/change/${projectId}`, finishDate, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса проекта'))
}

const ProfileService = {
  getAllProjects,
  getMyProjects,
  getProject,
  getAverageMarkProject,

  convertIdeaToProject,
  changeProjectStatus,
  finishProject,
  reportProject,
}

export default ProfileService
