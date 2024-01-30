import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import { tasksMocks } from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { Task } from '@Domain/Project'
import axios from 'axios'
import { develop } from '@Assets/images'
import { MODE } from '@Main'

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

const ProfileService = {
  getAllTasksProject,
  updateTasks,
}

export default ProfileService
