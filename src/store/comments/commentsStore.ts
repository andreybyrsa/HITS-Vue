import { defineStore } from 'pinia'
import InitialState from './initialState'

import Comment from '@Domain/Comment'

import CommentService from '@Services/CommentService'

const useCommentsStore = defineStore('comments', {
  state: (): InitialState => ({ comments: [], commentsError: '' }),
  actions: {
    async fetchComments(ideaId: string, token: string) {
      const response = await CommentService.fetchComments(ideaId, token)

      if (response instanceof Error) {
        return (this.commentsError = response.message)
      }

      this.comments = response
    },
    async postComment(comment: Comment, ideaId: string, token: string) {
      const response = await CommentService.postComment(comment, ideaId, token)

      if (response instanceof Error) {
        return (this.commentsError = response.message)
      }

      // this.comments.push(response)
    },

    async deleteComment(commentId: string, ideaId: string, token: string) {
      const response = await CommentService.deleteComment(commentId, ideaId, token)

      if (response instanceof Error) {
        return (this.commentsError = response.message)
      }

      // this.comments = this.comments.filter((comment) => comment.id !== commentId)
    },

    async checkComment(email: string, commentId: string, token: string) {
      const response = await CommentService.checkComment(commentId, token)

      if (response instanceof Error) {
        return (this.commentsError = response.message)
      }

      // const currentComment = this.comments.find(
      //   (comment) => comment.id === commentId,
      // )

      // currentComment?.checkedBy.push(email)
    },
  },
})

export default useCommentsStore
