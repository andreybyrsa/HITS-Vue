import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import { sprintMarksMocks, sprintMocks } from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { Sprint, SprintStatus, SprintMarks } from '@Domain/Project'
import Success from '@Domain/ResponseMessage'
import { MODE } from '@Main'
import axios from 'axios'

const sprintMocksAxios = defineAxios(sprintMocks)
const sprintMarksMocksAxios = defineAxios(sprintMarksMocks)

function formatterAllSprintsProject(sprints: Sprint[], currentProjectId: string) {
  return sprints.filter(({ projectId }) => projectId === currentProjectId)
}

function formatGetMarksSprint(sprintMarksMocks: SprintMarks[], sprintId?: string) {
  return sprintMarksMocks.filter((mark) => mark.sprintId === sprintId)
}

// --- GET --- //
const getAllSprintsProject = async (
  projectId: string,
  token: string,
): Promise<Sprint[] | Error> => {
  return sprintMocksAxios
    .get<Sprint[]>(
      `/api/v1/scrum-service/sprint/${projectId}/all`,
      {
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

const getSprint = async (
  sprintId: string,
  token: string,
): Promise<Sprint | Error> => {
  return sprintMocksAxios
    .get<Sprint>(
      `/api/v1/scrum-service/sprint/${sprintId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        params: { id: sprintId },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения спринтов'))
}

const getActiveSprintsProject = async (
  projectId: string,
  token: string,
): Promise<Sprint | Error> => {
  return sprintMocksAxios
    .get(
      `/api/v1/scrum-service/sprint/${projectId}/active`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        params: { projectId, status: 'ACTIVE' },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения спринтов'))
}

const getMarkSprint = async (
  sprintId: string,
  token: string,
): Promise<SprintMarks[] | Error> => {
  return sprintMarksMocksAxios
    .get<SprintMarks[]>(
      `/api/v1/scrum-service/sprint/marks/${sprintId}/all`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (sprintMarks) => formatGetMarksSprint(sprintMarks, sprintId),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения оценки за спринт'))
}

// --- PUT --- //
const updateSprint = async (
  sprint: Sprint,
  sprintId: string,
  token: string,
): Promise<Success | Error> => {
  return sprintMocksAxios
    .put<Success>(
      `/api/v1/scrum-service/sprint/${sprintId}/update`,
      sprint,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        params: { id: sprintId },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения спринта'))
}

const finishSprint = async (
  sprintId: string,
  finishDate: string,
  status: SprintStatus,
  report: string,
  token: string,
): Promise<Success | Error> => {
  if (MODE === 'DEVELOPMENT') {
    return sprintMocksAxios
      .putNoRequestBody<Success>(
        `/api/v1/scrum-service/sprint/${sprintId}/finish`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
        },
        {
          params: { id: sprintId },
          requestData: { finishDate: finishDate, status: status, report: report },
        },
      )
      .then((response) => response.data)
      .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса проекта'))
  }

  return axios
    .put<Success>(`/api/v1/scrum-service/sprint/finish/${sprintId}`, report, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain;charset=UTF-8',
      },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса проекта'))
}

// --- POST --- //
const postSprint = async (
  sprint: Sprint,
  token: string,
): Promise<Sprint | Error> => {
  return sprintMocksAxios
    .post(`/api/v1/scrum-service/sprint/add`, sprint, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка создания спринта'))
}

const postSprintMarks = async (
  sprintId: string,
  projectId: string,
  sprintMarks: SprintMarks[],
  token: string,
): Promise<SprintMarks[] | Error> => {
  return sprintMarksMocksAxios
    .post(
      `/api/v1/scrum-service/sprint/marks/${projectId}/${sprintId}/add`,
      sprintMarks,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка создания спринта'))
}

const saveMarkSprint = async (
  sprintId: string,
  marks: SprintMarks[],
  token: string,
): Promise<Success | Error> => {
  return axios
    .post<Success>(`/api/v1/scrum-service/sprint/${sprintId}/add/marks`, marks, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления оценки'))
}

const ProfileService = {
  getAllSprintsProject,
  getSprint,
  finishSprint,
  getActiveSprintsProject,
  postSprint,
  postSprintMarks,
  updateSprint,
  saveMarkSprint,
  getMarkSprint,
}

export default ProfileService
