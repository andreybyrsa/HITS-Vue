import { defineStore } from 'pinia'
import InitialState from './initialState'

import useWebSocket from '@Hooks/useWebSocket'

import Comment from '@Domain/Comment'

import CommentService from '@Services/CommentService'

const useCommentsStore = defineStore('comments', {
  state: (): InitialState => ({
    comments: [],
    rsocketIsConnected: false,
    closeRsocket: () => null,
    commentsError: '',
  }),
  actions: {
    async connectRsocket(ideaId: string) {
      const { isConnected, closeConnection } = await useWebSocket<Comment[]>(
        `comment.${ideaId}.receive`,
        this.comments,
      )
      if (isConnected.value === true) {
        this.rsocketIsConnected = true
        this.closeRsocket = closeConnection
      }
    },

    async fetchComments(ideaId: string, token: string) {
      const response = await CommentService.fetchComments(ideaId, token)

      if (response instanceof Error) {
        this.commentsError = response.message
        return response
      }

      this.comments = response
      return response
    },

    async postComment(comment: Comment, ideaId: string, token: string) {
      const response = await CommentService.postComment(comment, ideaId, token)

      if (response instanceof Error) {
        return (this.commentsError = response.message)
      }

      if (!this.rsocketIsConnected) {
        this.comments.push(response)
      }
    },

    async deleteComment(commentId: string, token: string) {
      const response = await CommentService.deleteComment(commentId, token)

      if (response instanceof Error) {
        return (this.commentsError = response.message)
      }

      this.comments = this.comments.filter((comment) => comment.id !== commentId)
    },

    async checkComment(email: string, commentId: string, token: string) {
      const response = await CommentService.checkComment(commentId, token)

      if (response instanceof Error) {
        return (this.commentsError = response.message)
      }

      const currentComment = this.comments.find(
        (comment) => comment.id === commentId,
      )

      currentComment?.checkedBy.push(email)
    },
  },
})

export default useCommentsStore
