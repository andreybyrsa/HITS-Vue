import { defineStore } from 'pinia'

import { Task } from '@Domain/Project'

import TaskService from '@Services/TaskService'

import InitialState from '@Store/tasks/initialState'
import useNotificationsStore from '@Store/notifications/notificationsStore'

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
    async changePosition(
      changeTasks: Task[],
      newIndex: number,
      oldIndex: number,
      token: string,
    ) {
      changeTasks.forEach((task, index) => {
        const changeTask = this.tasks.find((element) => task.id === element.id)

        if (changeTask) {
          changeTask.position = index + 1
        }
      })

      const response = TaskService.updateTasks(this.tasks, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      }
    },
  },
})

export default useTasksStore
