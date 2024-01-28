import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import { tasksMocks } from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { Task, TaskStatus } from '@Domain/Project'
import { User } from '@Domain/User'

const tasksMocksAxios = defineAxios(tasksMocks)

function formatterAllTasksProject(tasks: Task[], currentProjectId: string) {
  return tasks.filter(({ projectId }) => projectId === currentProjectId)
}

// --- GET --- //
const getAllTasksProject = async (
  projectId: string,
  token: string,
): Promise<Task[] | Error> => {
  return tasksMocksAxios
    .get<Task[]>(
      '/ТУТ-БУДЕТ-ЧТО-ТО',
      {
        // FIX ROUTE
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (tasks) => formatterAllTasksProject(tasks, projectId),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения задач'))
}

// --- PUT --- //
const changeExecutorTask = async (
  taskId: string,
  user: User | null,
  token: string,
): Promise<Task[] | Error> => {
  return tasksMocksAxios
    .putNoRequestBody<Task[]>(
      '/ТУТ-БУДЕТ-ЧТО-ТО',
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        params: { id: taskId },
        requestData: { executor: user },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения исполнителя задачи'))
}

const changeTaskStatus = async (
  taskId: string,
  status: TaskStatus,
  token: string,
): Promise<Task[] | Error> => {
  return tasksMocksAxios
    .putNoRequestBody<Task[]>(
      '/ТУТ-БУДЕТ-ЧТО-ТО',
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        params: { id: taskId },
        requestData: { status: status },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса задачи'))
}

const ProfileService = {
  getAllTasksProject,

  changeExecutorTask,
  changeTaskStatus,
}

export default ProfileService
