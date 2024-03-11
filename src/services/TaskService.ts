import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import { tasksMocks, taskMovementLogMocks } from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import axios from 'axios'
import { develop } from '@Assets/images'
import { MODE } from '@Main'
import { Task, TaskMovementLog, TaskStatus } from '@Domain/Project'
import { User } from '@Domain/User'

const tasksMocksAxios = defineAxios(tasksMocks)
const taskMovementLogMocksAxios = defineAxios(taskMovementLogMocks)
const tasksAxios = defineAxios(tasksMocks)

function formatterAllTasksProject(tasks: Task[], currentProjectId: string) {
  return tasks.filter(({ projectId }) => projectId === currentProjectId)
}
function formatterAllTaskMovementLog(
  logs: TaskMovementLog[],
  currentTaskId: string,
) {
  return logs.filter(({ task }) => task.id === currentTaskId)
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

const getTaskMovementLog = async (
  taskId: string,
  token: string,
): Promise<TaskMovementLog[] | Error> => {
  return taskMovementLogMocksAxios
    .get<TaskMovementLog[]>(
      '/ТУТ-БУДЕТ-ЧТО-ТО',
      {
        // FIX ROUTE
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (logs) => formatterAllTaskMovementLog(logs, taskId),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения задач'))
}

const createTaskLog = async (
  log: TaskMovementLog,
  token: string,
): Promise<TaskMovementLog | Error> => {
  return taskMovementLogMocksAxios
    .post('/task/logs/add', log, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления тега'))
}

const createTask = async (task: Task, token: string): Promise<Task | Error> => {
  return tasksMocksAxios
    .post('/task/add', task, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления тега'))
}

const updateTasks = async (
  tasks: Task[],
  token: string,
): Promise<Task[] | Error> => {
  if (MODE == 'DEVELOPMENT') {
    const mockTasks = tasksMocksAxios.getReactiveMocks()
    console.log(mockTasks)

    mockTasks.value.forEach((task) =>
      tasks.find((newTask) => {
        if (newTask.id === task.id) {
          task.position = newTask.position
        }
      }),
    )
    console.log(mockTasks)
  }
  return axios
    .put(`/task/update/}`, tasks, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка редактирования задач'))
}
const updateTask = async (
  task: Task,
  id: string,
  token: string,
): Promise<Task | Error> => {
  return tasksAxios
    .put(
      `/task/update/${id}`,
      task,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка редактирования задачи'))
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
  newStatusLog: TaskStatus[],
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
        requestData: { status: status, taskMovementLog: newStatusLog },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса задачи'))
}

const changeTaskStatusInBackLog = async (
  taskId: string,
  status: 'InBackLog',
  newStatusLog: TaskStatus[],
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
        requestData: { status: status, taskMovementLog: newStatusLog },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса задачи'))
}

const changeLeaderComment = async (
  taskId: string,
  leaderComment: string,
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
        requestData: { leaderComment },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса задачи'))
}

const changeDescription = async (
  taskId: string,
  description: string,
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
        requestData: { description },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса задачи'))
}

const changeName = async (
  taskId: string,
  name: string,
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
        requestData: { name },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса задачи'))
}

const TaskService = {
  getAllTasksProject,
  getTaskMovementLog,

  createTaskLog,
  createTask,
  updateTasks,
  updateTask,

  changeExecutorTask,
  changeTaskStatus,
  changeTaskStatusInBackLog,
  changeLeaderComment,
  changeDescription,
  changeName,
}

export default TaskService
