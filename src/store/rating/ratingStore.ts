import { defineStore } from 'pinia'

import { Rating } from '@Domain/Idea'

import RatingService from '@Services/RatingService'

import InitialState from '@Store/rating/initialState'
import useNotificationsStore from '@Store/notifications/notificationsStore'

const useRatingStore = defineStore('rating', {
  state: (): InitialState => ({
    ratings: [],
  }),
  actions: {
    async fetchRatingsByIdeaId(ideaId: number, token: string) {
      const index = this.ratings.findIndex((item) => item.ideaId === ideaId)
      if (index === -1) {
        const response = await RatingService.getAllIdeaRatings(ideaId, token)
        if (response instanceof Error) {
          return useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
        }
        this.ratings.push({
          ideaId,
          ratings: response,
        })
      }
    },
    async fetchRatings(ideaId: number, token: string) {
      const response = await RatingService.getAllIdeaRatings(ideaId, token)
      if (response instanceof Error) {
        return useNotificationsStore().createSystemNotification(
          'Система',
          response.message,
        )
      }
      const index = this.ratings.findIndex((item) => item.ideaId === ideaId)
      if (index !== -1) {
        this.ratings[index].ratings = response
      } else {
        this.ratings.push({ ideaId, ratings: response })
      }
    },
    async saveRating(rating: Rating, ideaId: number, token: string) {
      const response = await RatingService.saveExpertRating(rating, ideaId, token)
      if (response instanceof Error) {
        return useNotificationsStore().createSystemNotification(
          'Система',
          response.message,
        )
      }
      const index = this.ratings.findIndex((item) => item.ideaId === ideaId)
      if (index !== -1) {
        const ratingIndex = this.ratings[index].ratings.findIndex(
          (ratings) => ratings.id === rating.id,
        )
        if (ratingIndex !== -1) {
          this.ratings[index].ratings[ratingIndex] = rating
        } else {
          this.ratings[index].ratings.push(rating)
        }
      } else {
        this.ratings.push({ ideaId, ratings: [rating] })
      }
    },
    async confirmRating(rating: Rating, ideaId: number, token: string) {
      const response = await RatingService.confirmExpertRating(rating, ideaId, token)
      if (response instanceof Error) {
        return useNotificationsStore().createSystemNotification(
          'Система',
          response.message,
        )
      }
      const index = this.ratings.findIndex((item) => item.ideaId === ideaId)
      if (index !== -1) {
        const ratingIndex = this.ratings[index].ratings.findIndex(
          (ratings) => ratings.id === rating.id,
        )
        if (ratingIndex !== -1) {
          this.ratings[index].ratings[ratingIndex] = rating
          this.ratings[index].ratings[ratingIndex].confirmed = true
        } else {
          rating.confirmed = true
          this.ratings[index].ratings.push(rating)
        }
      } else {
        rating.confirmed = true
        this.ratings.push({ ideaId, ratings: [rating] })
      }
    },
  },
  getters: {
    getRatingByIdeaIdAndExpert:
      (state) => async (ideaId: number, expertId: number, token: string) => {
        const index = state.ratings.findIndex((item) => item.ideaId === ideaId)
        if (index !== -1) {
          const rating = state.ratings[index].ratings.find(
            (rating) => rating.expertId === expertId,
          )
          if (rating) {
            return rating
          }
        }
        const response = await RatingService.getExpertRating(ideaId, token)
        if (response instanceof Error) {
          return useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
        }
        return response
      },
  },
})
export default useRatingStore
