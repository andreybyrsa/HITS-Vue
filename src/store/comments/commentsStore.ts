import { defineStore } from 'pinia'
import InitialState from './initialState'

import Comment from '@Domain/Comment'

import CommentService from '@Services/CommentService'

const useCommentsStore = defineStore('comments', {
  state: (): InitialState => ({ comments: [], commentsError: '' }),
  actions: {
    async fetchIdeaComments(ideaId: number, token: string) {
      const response = await CommentService.fetchIdeaComments(ideaId, token)

      if (response instanceof Error) {
        return (this.commentsError = response.message)
      }

      this.comments = response.comments.sort((prevComment, comment) => {
        const prevDate = new Date(prevComment.dateCreated).getTime()
        const date = new Date(comment.dateCreated).getTime()

        return prevDate - date
      })
    },

    async postComment(comment: Comment, ideaId: number, token: string) {
      const response = await CommentService.addComment(comment, ideaId, token)

      if (response instanceof Error) {
        return (this.commentsError = response.message)
      }

      this.comments.push(response)
    },

    async deleteComment(commentId: number, token: string) {
      const response = await CommentService.deleteComment(commentId, token)

      if (response instanceof Error) {
        return (this.commentsError = response.message)
      }

      this.comments = this.comments.filter((comment) => comment.id !== commentId)
    },

    async checkComment(email: string, commentId: number, token: string) {
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
