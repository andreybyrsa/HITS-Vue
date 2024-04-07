import { defineStore } from 'pinia'

import SprintService from '@Services/SprintService'

import InitialState from '@Store/sprints/initialState'
import { Sprint, SprintStatus, SprintMarks, Task } from '@Domain/Project'
import { tasksMocks } from '@Utils/getMocks'
import { MODE } from '@Main'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useTasksStore from '@Store/tasks/tasksStore'

const useSprintsStore = defineStore('sprints', {
  state: (): InitialState => ({
    sprints: [],
    activeSprint: undefined,
  }),

  getters: {
    getAllSprints() {
      return async (projectId: string, token: string) => {
        const response = await SprintService.getAllSprintsProject(projectId, token)

        if (response instanceof Error) {
          return response
        }

        this.sprints = response
        return this.sprints
      }
    },

    getActiveSprint() {
      return async (projectId: string, token: string) => {
        const response = await SprintService.getActiveSprintsProject(
          projectId,
          token,
        )

        if (response instanceof Error) {
          return response
        }

        this.activeSprint = response
        return this.activeSprint
      }
    },
  },

  actions: {
    async postSprint(sprint: Sprint, token: string) {
      const response = await SprintService.postSprint(sprint, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.sprints.push(response)

        if (MODE === 'DEVELOPMENT') {
          tasksMocks.forEach((task) => {
            if (sprint.tasks.find(({ id }) => id === task.id)) {
              task.sprintId = response.id
              task.status = 'NewTask'
            }
          })
        }

        useTasksStore().tasks.forEach((task) => {
          if (task.status === 'InBackLog' && sprint.tasks.includes(task)) {
            task.sprintId = response.id
            task.status = 'NewTask'
          }
        })
      }
    },

    // async changeSprintStatus(sprintId: string, status: SprintStatus, token: string) {
    //   const response = await SprintService.changeSprintStatus(
    //     sprintId,
    //     status,
    //     token,
    //   )

    //   if (response instanceof Error) {
    //     useNotificationsStore().createSystemNotification('Система', response.message)
    //   } else {
    //     const currentSprint = this.sprints.find(({ id }) => id === sprintId)
    //     if (currentSprint) {
    //       currentSprint.status = status
    //     }
    //     this.activeSprint = undefined
    //   }
    // },

    // async reportSprint(sprintId: string, report: string, token: string) {
    //   const response = await SprintService.reportSprint(sprintId, report, token)

    //   if (response instanceof Error) {
    //     useNotificationsStore().createSystemNotification('Система', response.message)
    //   } else {
    //     const currentSprint = this.sprints.find(({ id }) => id === sprintId)

    //     if (currentSprint) {
    //       currentSprint.report = report
    //     }
    //   }
    // },

    async finishSprint(
      sprintId: string,
      finishDate: string,
      status: SprintStatus,
      report: string,
      tasks: Task[],
      token: string,
    ) {
      const response = await SprintService.finishSprint(
        sprintId,
        finishDate,
        status,
        report,
        tasks,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentSprint = this.sprints.find(({ id }) => id === sprintId)
        const tasksStore = useTasksStore().tasks

        tasksStore.forEach((task) => {
          if (tasks.find(({ id }) => id === task.id)) {
            task.sprintId = undefined
            task.position =
              tasksStore.filter(({ status }) => status === 'InBackLog').length + 1
            task.executor = null
            task.status = 'InBackLog'
          }
        })

        if (currentSprint) {
          currentSprint.report = report
          currentSprint.status = status
          currentSprint.finishDate = finishDate
        }
        this.activeSprint = undefined
      }
    },

    async updateSprint(sprint: Sprint, sprintId: string, token: string) {
      const response = await SprintService.updateSprint(sprint, sprintId, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const index = this.sprints.findIndex(({ id }) => id === sprintId)
        if (index !== -1) {
          this.sprints[index] = { ...sprint, id: sprintId }
        }

        if (MODE === 'DEVELOPMENT') {
          tasksMocks.forEach((task) => {
            if (sprint.tasks.find(({ id }) => id === task.id)) {
              task.sprintId = sprintId
              task.status = 'NewTask'
            }
          })
        }

        useTasksStore().tasks.forEach((task) => {
          if (task.status === 'InBackLog' && sprint.tasks.includes(task)) {
            task.sprintId = sprintId
            task.status = 'NewTask'
          }
        })
      }
    },

    async saveMarkSprint(sprintId: string, marks: SprintMarks[], token: string) {
      const response = await SprintService.saveMarkSprint(sprintId, marks, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentSprint = this.sprints.find(({ id }) => id === sprintId)

        if (currentSprint && currentSprint.marks) {
          currentSprint.marks = marks
        }
      }
    },
  },
})

export default useSprintsStore
