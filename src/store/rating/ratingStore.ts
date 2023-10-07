import { defineStore } from 'pinia'
import { Rating } from '@Domain/Idea'
import RatingService from '@Services/RatingService'
import InitialState from './initialState'
const useRatingStore = defineStore('rating', {
  state: (): InitialState => ({
    ratings: [],
  }),
  actions: {
    async fetchRatingsByIdeaId(ideaId: string, token: string) {
      const index = this.ratings.findIndex((item) => item.ideaId === ideaId)
      if (index === -1) {
        const response = await RatingService.getAllIdeaRatings(ideaId, token)
        if (response instanceof Error) {
          return
        }
        this.ratings.push({
          ideaId,
          ratings: response,
        })
      }
    },
    async fetchRatings(ideaId: string, token: string) {
      const response = await RatingService.getAllIdeaRatings(ideaId, token)
      if (response instanceof Error) {
        return
      }
      const index = this.ratings.findIndex((item) => item.ideaId === ideaId)
      if (index !== -1) {
        this.ratings[index].ratings = response
      } else {
        this.ratings.push({ ideaId, ratings: response })
      }
    },
    async saveRating(rating: Rating, ideaId: string, token: string) {
      const response = await RatingService.saveExpertRating(rating, ideaId, token)
      if (response instanceof Error) {
        return
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
    async confirmRating(rating: Rating, ideaId: string, token: string) {
      const response = await RatingService.confirmExpertRating(rating, ideaId, token)
      if (response instanceof Error) {
        return
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
      (state) => async (ideaId: string, expert: string, token: string) => {
        const index = state.ratings.findIndex((item) => item.ideaId === ideaId)
        if (index !== -1) {
          const rating = state.ratings[index].ratings.find(
            (rating) => rating.expert === expert,
          )
          if (rating) {
            return rating
          }
        }
        const response = await RatingService.getExpertRating(ideaId, token)
        if (response instanceof Error) {
          return
        }
        return response
      },
  },
})
export default useRatingStore
