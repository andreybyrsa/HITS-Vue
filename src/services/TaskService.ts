import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import { tasksMocks, taskMovementLogMocks } from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import axios from 'axios'
import { MODE } from '@Main'
import { Task, TaskMovementLog, TaskStatus } from '@Domain/Project'
import { User } from '@Domain/User'
import useTasksStore from '@Store/tasks/tasksStore'
import Success from '@Domain/ResponseMessage'

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
      `/scrum-service/task/project/all/${projectId}`,
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
      `/scrum-service/log/all/${taskId}`,
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
  if (MODE === 'DEVELOPMENT') {
    const { name, description, workHour, tags, projectId } = task
    const currentUser = useUserStore().user
    const position =
      useTasksStore().tasks.filter(({ status }) => status === 'InBackLog').length + 1
    const currentDate = new Date().toJSON().toString()

    if (currentUser) {
      const currentTask: Task = {
        id: '',
        projectId,
        name,
        description,
        initiator: currentUser,
        executor: null,
        workHour,
        position,
        startDate: currentDate,
        tags,
        status: 'InBackLog',
      }

      return tasksMocksAxios
        .post('/task/add', currentTask, {
          headers: { Authorization: `Bearer ${token}` },
          signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
        })
        .then((response) => response.data)
        .catch((error) => handleAxiosError(error, 'Ошибка добавления тега'))
    }
  }

  return axios
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
    tasksMocks.forEach((task) =>
      tasks.find(({ id, position }) => id === task.id && (task.position = position)),
    )
    return tasksMocks
  }
  return axios
    .put(`/scrum-service/task`, tasks, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка редактирования задач'))
}
const updateTask = async (task: Task, token: string): Promise<Success | Error> => {
  return tasksAxios
    .put<Success>(
      `/scrum-service/task/update/${task.id}`,
      task,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id: task.id } },
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
      '`/scrum-service/task',
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
): Promise<Task | Error> => {
  return tasksMocksAxios
    .putNoRequestBody<Task>(
      '/scrum-service/task/status/change',
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

const changeTaskStatusInBackLog = async (
  tasks: Task[],
  status: TaskStatus,
  token: string,
): Promise<Task[] | Error> => {
  if (MODE == 'DEVELOPMENT') {
    const mockTasks = tasksMocksAxios.getReactiveMocks()
    mockTasks.value.forEach((task) =>
      tasks.find((newTask) => {
        if (newTask.id === task.id) {
          task.status = newTask.status
        }
      }),
    )
  }
  return tasksMocksAxios
    .putNoRequestBody<Task[]>(
      '/ТУТ-БУДЕТ-ЧТО-ТО',
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        requestData: { status: status },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса задачи'))
}

// const changeTaskMovementLog = async (
//   tasks: Task[],
//   newStatusLog: TaskStatus[],
//   token: string,
// ): Promise<Task[] | Error> => {
//   if (MODE == 'DEVELOPMENT') {
//     const mockTasks = tasksMocksAxios.getReactiveMocks()
//     console.log(mockTasks)
//   }
//   return axios
//     .put(`/task/update/}`, tasks, {
//       headers: { Authorization: `Bearer ${token}` },
//       signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
//     })
//     .then((response) => response.data)
//     .catch((error) => handleAxiosError(error, 'Ошибка редактирования задач'))
// }

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
