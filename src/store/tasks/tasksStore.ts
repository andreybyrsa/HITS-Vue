import { defineStore } from 'pinia'

import { Task } from '@Domain/Project'

import TaskService from '@Services/TaskService'

import InitialState from '@Store/tasks/initialState'
import { User } from '@Domain/User'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import { TaskStatus } from '@Domain/Project'

const useTasksStore = defineStore('tasks', {
  state: (): InitialState => ({
    tasks: [],
  }),

  getters: {
    getAllTasks() {
      return async (projectId: string, token: string) => {
        const response = await TaskService.getAllTasksProject(projectId, token)

        if (response instanceof Error) {
          return response
        }

        this.tasks = response
        return this.tasks
      }
    },
  },

  actions: {
    async changeExecutorTask(taskId: string, user: User | null, token: string) {
      const response = await TaskService.changeExecutorTask(taskId, user, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentTask = this.tasks.find(({ id }) => id === taskId)
        if (currentTask) {
          currentTask.executor = user
        }
      }
    },

    async changeTaskStatus(taskId: string, status: TaskStatus, token: string) {
      const response = await TaskService.changeTaskStatus(taskId, status, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentTask = this.tasks.find(({ id }) => id === taskId)
        if (currentTask) {
          currentTask.status = status
        }
      }
    },
    async createTask(task: Task, token: string) {
      const response = await TaskService.createTask(task, token)
      console.log(task)
      console.log(response)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.tasks.push(task)
      }
    },
  },
})

export default useTasksStore
