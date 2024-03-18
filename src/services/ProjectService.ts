import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import { averageMarkMocks, projectMocks } from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { Project, ProjectStatus } from '@Domain/Project'
import { AverageMark, ReportProject } from '@Domain/ReportProjectMembers'
import Success from '@Domain/ResponseMessage'
import axios from 'axios'
import { API_URL, MODE } from '@Main'
import { IdeaMarket } from '@Domain/IdeaMarket'
import { Team } from '@Domain/Team'

const projectMocksAxios = defineAxios(projectMocks)
const averageMarkMocksAxios = defineAxios(averageMarkMocks)

function getMemberRole(userId: string, team: Team, ideaMarket: IdeaMarket) {
  if (team.leader?.userId === userId) {
    return 'TEAM_LEADER'
  }
  if (ideaMarket.initiator.id === userId) {
    return 'MEMBER'
  }
  return 'INITIATOR'
}

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

function formatGetReportProject(
  reportProjectMocks: ReportProject[],
  projectId: string,
) {
  return reportProjectMocks.filter((report) => report.projectId === projectId)
}

// --- GET --- //
const getAllProjects = async (token: string): Promise<Project[] | Error> => {
  return projectMocksAxios
    .get('/scrum-service/project/all', {
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
      `/scrum-service/project/active/all`,
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

// const getReportProject = async (
//   projectId: string,
//   token: string,
// ): Promise<ReportProject[] | Error> => {
//   return reportProjectMocksAxios
//     .get<ReportProject[]>(
//       '/reportProject', // FIX ROUTE
//       {
//         headers: { Authorization: `Bearer ${token}` },
//         signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
//       },
//       {
//         formatter: (reportProject) =>
//           formatGetReportProject(reportProject, projectId),
//       },
//     )
//     .then((response) => response.data)
//     .catch((error) => handleAxiosError(error, 'Ошибка получения отчета за проект'))
// }

// --- POST --- //
const convertIdeaToProject = async (
  ideaMarket: IdeaMarket,
  token: string,
): Promise<Project | Error> => {
  if (MODE === 'DEVELOPMENT') {
    const { team, name, description, customer, initiator } = ideaMarket
    const currentDate = new Date().toJSON().toString()
    if (team) {
      const { members, name: teamName, id: teamId } = team

      const project: Project = {
        id: '0000000',
        name,
        description,
        customer,
        initiator,
        team,
        members: members.map(({ userId, email, firstName, lastName }) => {
          const currentDate = new Date().toJSON().toString()
          return {
            projectName: name,
            teamId,
            teamName,
            userId,
            email,
            firstName,
            lastName,
            startDate: currentDate,
            finishDate: '',
            projectRole: getMemberRole(userId, team, ideaMarket),
          }
        }),
        report: {
          projectId: '',
          marks: [],
          report: '',
        },

        startDate: currentDate,
        finishDate: '',
        status: 'ACTIVE',
      }

      return projectMocksAxios
        .post(`${API_URL}/scrum-service/project/send`, project, {
          headers: { Authorization: `Bearer ${token}` },
          signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
        })
        .then((response) => response.data)
        .catch((error) =>
          handleAxiosError(error, 'Ошибка конвертации идеи в проект'),
        )
    }
  }

  return axios
    .post(`${API_URL}/scrum-service/project/send`, ideaMarket, {
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
