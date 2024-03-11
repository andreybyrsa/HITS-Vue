import { defineStore } from 'pinia'
import { Comment } from '@Domain'
import { useWebSocket, useNotification } from '@Hooks'
import { CommentService } from '@Service'

interface InitialState {
  comments: Comment[] | null
  rsocketIsConnected: boolean
  closeRsocket: () => void
}

export const useCommentsStore = defineStore('comments', {
  state: (): InitialState => ({
    comments: null,
    rsocketIsConnected: false,
    closeRsocket: () => null,
  }),

  getters: {
    getComments() {
      return async (ideaId: string) => {
        const response = await CommentService.get(ideaId)

        if (response instanceof Error) {
          return response
        }

        this.comments = response
        return this.comments
      }
    },
  },

  actions: {
    async connectRsocket(ideaId: string) {
      if (this.comments) {
        const { isConnected, closeConnection } = await useWebSocket<Comment[]>(
          `comment.${ideaId}.receive`,
          this.comments,
        )

        if (isConnected.value === true) {
          this.rsocketIsConnected = true
          this.closeRsocket = closeConnection
        }
      }
    },
    async disconnectRsocket() {
      if (this.rsocketIsConnected) {
        this.rsocketIsConnected = false
        this.closeRsocket()
      }
    },

    async createComment(comment: Comment) {
      const response = await CommentService.create(comment)

      if (response instanceof Error) {
        useNotification('Система', response.message)
      } else {
        if (!this.rsocketIsConnected) {
          this.comments?.push(response)
        }
      }
    },

    async deleteComment(commentId: string) {
      const response = await CommentService.remove(commentId)

      if (response instanceof Error) {
        useNotification('Система', response.message)
      } else if (this.comments) {
        const deletingCommentIndex = this.comments.findIndex(
          (comment) => comment.id === commentId,
        )
        if (deletingCommentIndex !== -1) {
          this.comments.splice(deletingCommentIndex, 1)
        }
      }
    },

    async checkComment(commentId: string, userId: string) {
      const response = await CommentService.check(commentId, userId)

      if (response instanceof Error) {
        useNotification('Система', response.message)
      } else {
        const currentComment = this.comments?.find(
          (comment) => comment.id === commentId,
        )
        currentComment?.checkedBy.push(userId)
      }
    },
  },
})
