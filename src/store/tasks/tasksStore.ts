import { defineStore } from 'pinia'

import TaskService from '@Services/TaskService'

import InitialState from '@Store/tasks/initialState'
import { User } from '@Domain/User'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import { TaskStatus, Task, TaskMovementLog } from '@Domain/Project'

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
    async changePosition(changeTasks: Task[], token: string) {
      changeTasks.forEach((task, index) => (task.position = index + 1))

      const response = await TaskService.moveTask(changeTasks, token)

      if (response instanceof Error) {
        return useNotificationsStore().createSystemNotification(
          'Система',
          response.message,
        )
      }

      this.tasks.forEach((task) => {
        const currentTask = changeTasks.find(({ id }) => id === task.id)

        if (currentTask) task = currentTask
      })
    },

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
      const curTask = this.tasks.find(({ id }) => id === taskId)

      if (curTask) {
        const response = await TaskService.changeTaskStatus(taskId, status, token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
        } else {
          const currentTask = this.tasks.find(({ id }) => id === taskId)
          if (currentTask) {
            currentTask.status = status
          }
        }
      }
    },

    async changeTaskStatusInBackLog(
      tasks: Task[],
      status: TaskStatus,
      token: string,
    ) {
      tasks.forEach((task) => {
        const changeTask = this.tasks.find((element) => task.id === element.id)

        if (changeTask) {
          changeTask.status = status
        }
      })

      const response = await TaskService.changeTaskStatusInBackLog(
        this.tasks,
        status,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      }
    },

    async createTask(task: Task, token: string) {
      const response = await TaskService.createTask(task, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.tasks.push(response)
      }
    },

    async updateTask(task: Task, token: string) {
      const response = await TaskService.updateTask(task, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.tasks = this.tasks.map((currentTask) =>
          currentTask.id === task.id ? task : currentTask,
        )
      }
    },

    async createTaskLog(
      taskId: string,
      user: User | null,
      newStatus: TaskStatus,
      token: string,
    ) {
      const currentTask = this.tasks.find(({ id }) => id === taskId)
      const taskLogs = await TaskService.getTaskMovementLog(taskId, token)

      if (taskLogs instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', taskLogs.message)
      }

      if (currentTask && user) {
        const log: TaskMovementLog = {
          id: '',
          task: currentTask,
          executor: currentTask.executor,
          user: user,
          startDate: new Date().toJSON().toString(),
          endDate: '',
          status: newStatus,
        }

        const response = await TaskService.createTaskLog(log, token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
        } else {
          currentTask.status = newStatus
        }
      }
    },

    async changeLeaderComment(taskId: string, leaderComment: string, token: string) {
      const currentTask = this.tasks.find(({ id }) => id === taskId)

      if (!currentTask) {
        return
      }

      currentTask.leaderComment = leaderComment

      const response = await TaskService.changeLeaderComment(
        taskId,
        leaderComment,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return
      }
    },

    async changeDescription(taskId: string, description: string, token: string) {
      const currentTask = this.tasks.find(({ id }) => id === taskId)

      if (!currentTask) {
        return
      }

      currentTask.description = description

      const response = await TaskService.changeDescription(
        taskId,
        description,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return
      }
    },

    async changeName(taskId: string, name: string, token: string) {
      const currentTask = this.tasks.find(({ id }) => id === taskId)

      if (!currentTask) {
        return
      }

      currentTask.name = name

      const response = await TaskService.changeName(taskId, name, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return
      }
    },

    async changeExecutorComment(
      taskId: string,
      executorComment: string,
      token: string,
    ) {
      const currentTask = this.tasks.find(({ id }) => id === taskId)

      if (!currentTask) {
        return
      }

      currentTask.executorComment = executorComment

      const response = await TaskService.changeExecutorComment(
        taskId,
        executorComment,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return
      }
    },
  },
})

export default useTasksStore
