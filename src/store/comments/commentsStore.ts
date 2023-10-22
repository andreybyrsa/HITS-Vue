import { defineStore } from 'pinia'
import InitialState from './initialState'

import useWebSocket from '@Hooks/useWebSocket'

import Comment from '@Domain/Comment'

import CommentService from '@Services/CommentService'

const useCommentsStore = defineStore('comments', {
  state: (): InitialState => ({
    comments: null,
    rsocketIsConnected: false,
    closeRsocket: () => null,
  }),
  getters: {
    getComments() {
      return async (ideaId: number, token: string) => {
        const response = await CommentService.getComments(ideaId, token)

        if (response instanceof Error) {
          return response
        }

        this.comments = response
        return this.comments
      }
    },
  },
  actions: {
    async connectRsocket(ideaId: number) {
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

    async createComment(comment: Comment, token: string) {
      const response = await CommentService.createComment(comment, token)

      if (response instanceof Error) {
        // notification
      } else {
        if (!this.rsocketIsConnected) {
          this.comments?.push(response)
        }
      }
    },

    async deleteComment(commentId: number, token: string) {
      const response = await CommentService.deleteComment(commentId, token)

      if (response instanceof Error) {
        // notification
      } else {
        const currentCommentIndex = this.comments?.findIndex(
          (comment) => comment.id === commentId,
        )
        if (currentCommentIndex !== undefined && currentCommentIndex !== -1) {
          this.comments?.splice(currentCommentIndex, 1)
        }
      }
    },

    async checkComment(userId: number, commentId: number, token: string) {
      const response = await CommentService.checkComment(userId, commentId, token)

      if (response instanceof Error) {
        // notification
      } else {
        const currentComment = this.comments?.find(
          (comment) => comment.id === commentId,
        )
        currentComment?.checkedBy.push(userId)
      }
    },
  },
})

export default useCommentsStore
