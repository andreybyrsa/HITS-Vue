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
    // getTaskLogs() {
    //   return async (taskId: string, token: string) => {
    //     const response = await TaskService.getTaskMovementLog(taskId, token)

    //     if (response instanceof Error) {
    //       return response
    //     }

    //     this.logs = response
    //     return this.logs
    //   }
    // },
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
        const lastStatus = curTask.status
        const newStatusLog = curTask.taskMovementLog.concat(lastStatus)

        if (lastStatus && newStatusLog) {
          curTask?.taskMovementLog.push(lastStatus)
        }
        const response = await TaskService.changeTaskStatus(
          taskId,
          status,
          newStatusLog,
          token,
        )

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

    async createTask(task: Task, token: string) {
      const response = await TaskService.createTask(task, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.tasks.push(response)
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
      } else {
        const lastLog = taskLogs.reduce((prev, current) =>
          new Date(prev.endDate) > new Date(current.endDate) ? prev : current,
        )

        if (currentTask && user) {
          const log: TaskMovementLog = {
            id: '',
            task: currentTask,
            executor: currentTask.executor,
            user: user,
            startDate: new Date().toJSON().toString(),
            endDate: '',
            taskStatus: newStatus,
          }

          const response = await TaskService.createTaskLog(log, token)

          if (response instanceof Error) {
            useNotificationsStore().createSystemNotification(
              'Система',
              response.message,
            )
          }
        }
      }
    },

    async changeLeaderComment(taskId: string, leaderComment: string, token: string) {
      const currentTask = this.tasks.find(({ id }) => id === taskId)

      if (!currentTask) {
        return
      }

      const response = await TaskService.changeLeaderComment(
        taskId,
        leaderComment,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
        return
      }

      currentTask.leaderComment = leaderComment
    },
  },
})

export default useTasksStore
