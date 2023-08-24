import { defineStore } from 'pinia'
import InitialState from './initialState'

import { Idea } from '@Domain/Idea'
import Comment from '@Domain/Comment'

import IdeasService from '@Services/IdeasService'
import CommentService from '@Services/CommentService'

const useIdeasStore = defineStore('ideas', {
  state: (): InitialState => ({
    ideas: [],
    initiatorIdeas: [],
  }),
  actions: {
    async fetchIdeas(token: string) {
      this.ideas = await IdeasService.fetchIdeas(token)
    },
    async postInitiatorIdeas(idea: Idea, token: string) {
      await IdeasService.postInitiatorIdea(idea, token)
    },
    async getInitiatorIdeas(token: string) {
      await IdeasService.getInitiatorIdeas(token)
    },
    async deleteInitiatorIdeas(id: number, token: string) {
      await IdeasService.deleteInitiatorIdea(id, token)
    },
    async putInitiatorIdeas(idea: Idea, id: number, token: string) {
      await IdeasService.putInitiatorIdea(idea, id, token)
    },

    async addComment(comment: Comment, ideaID: number, token: string) {
      const response = await CommentService.addComment(comment, ideaID, token)

      if (response instanceof Error) {
        return
      }

      const currentIdea = this.ideas.find((idea) => idea.id === ideaID)
      currentIdea?.comments.push(response)
    },

    async deleteComment(ideaID: number, commentID: number, token: string) {
      const response = await CommentService.deleteComment(ideaID, commentID, token)

      if (response instanceof Error) {
        return
      }

      const currentIdea = this.ideas.find((idea) => idea.id === ideaID)

      if (currentIdea) {
        currentIdea.comments = currentIdea.comments.filter(
          (comment) => comment.id !== commentID,
        )
      }
    },

    async checkComment(ideaID: number, comment: Comment, token: string) {
      await CommentService.checkComment(ideaID, comment, token)

      const currentIdea = this.ideas.find((idea) => idea.id === ideaID)

      if (currentIdea) {
        const commentIndex = currentIdea.comments.findIndex(
          (ideaComment) => ideaComment.id === comment.id,
        )

        if (commentIndex !== -1) {
          currentIdea.comments.splice(commentIndex, 1, comment)
        }
      }
    },
  },
})

export default useIdeasStore
