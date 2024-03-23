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

function formatGetMarksSprint(sprintMarksMocks: SprintMarks[], sprintId: string) {
  return sprintMarksMocks.filter((mark) => mark.sprintId === sprintId)
}

// --- GET --- //
const getAllSprintsProject = async (
  projectId: string,
  token: string,
): Promise<Sprint[] | Error> => {
  return sprintMocksAxios
    .get<Sprint[]>(
      `/scrum-service/sprint/${projectId}/all`,
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

const getActiveSprintsProject = async (
  projectId: string,
  token: string,
): Promise<Sprint | Error> => {
  return sprintMocksAxios
    .get(
      '/ТУТ-БУДЕТ-ЧТО-ТО',
      {
        // FIX ROUTE
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
      '/sprint/mark', // FIX ROUTE
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

const changeSprintStatus = async (
  sprintId: string,
  status: SprintStatus,
  token: string,
): Promise<Success | Error> => {
  return sprintMocksAxios
    .putNoRequestBody<Success>(
      `/sprint/status/update/${sprintId}/${status}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        params: { id: sprintId },
        requestData: { status: status },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса проекта'))
}

const updateSprint = async (
  sprint: Sprint,
  sprintId: string,
  token: string,
): Promise<Success | Error> => {
  return sprintMocksAxios
    .put<Success>(
      `/sprint`, //  FIX
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

const reportSprint = async (
  sprintId: string,
  report: string,
  token: string,
): Promise<Success | Error> => {
  if (MODE === 'DEVELOPMENT') {
    return sprintMocksAxios
      .putNoRequestBody<Success>(
        `/sprint/report/change/${sprintId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
        },
        {
          params: { id: sprintId },
          requestData: { report: report },
        },
      )
      .then((response) => response.data)
      .catch((error) => handleAxiosError(error, 'Ошибка заполнения отчета проекта'))
  }
  return axios
    .put<Success>(`/sprint/report/change/${sprintId}`, report, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка заполнения отчета проекта'))
}

const finishSprintDate = async (
  sprintId: string,
  finishDate: string,
  token: string,
): Promise<Success | Error> => {
  if (MODE === 'DEVELOPMENT') {
    return sprintMocksAxios
      .putNoRequestBody<Success>(
        `/sprint/finish/change/${sprintId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
        },
        {
          params: { id: sprintId },
          requestData: { finishDate: finishDate },
        },
      )
      .then((response) => response.data)
      .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса проекта'))
  }
  return axios
    .put<Success>(`/sprint/finish/change/${sprintId}`, finishDate, {
      headers: { Authorization: `Bearer ${token}` },
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
    .post(
      'some-address', // FIX ROUTE
      sprint,
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
    .post<Success>(`/sprint/marks/${sprintId}`, marks, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления оценки'))
}

const ProfileService = {
  getAllSprintsProject,
  changeSprintStatus,
  reportSprint,
  finishSprintDate,
  getActiveSprintsProject,
  postSprint,
  updateSprint,
  saveMarkSprint,
  getMarkSprint,
}

export default ProfileService
