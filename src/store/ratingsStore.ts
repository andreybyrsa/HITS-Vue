import { defineStore } from 'pinia'
import { Rating } from '@Domain'
import { useIdeasStore } from '@Store'
import { useNotification } from '@Hooks'
import { RatingService } from '@Service'
import { findOneAndUpdate } from '@Utils'

interface InitialState {
  ratings: { ideaId: string; ideaRatings: Rating[] }[]
}

const setIdeaRating = (ideaRating: Rating, newRating: Rating) => {
  const {
    rating,
    marketValue,
    originality,
    technicalRealizability,
    suitability,
    budget,
    isConfirmed,
  } = newRating

  ideaRating.rating = rating
  ideaRating.marketValue = marketValue
  ideaRating.originality = originality
  ideaRating.technicalRealizability = technicalRealizability
  ideaRating.suitability = suitability
  ideaRating.budget = budget
  ideaRating.isConfirmed = isConfirmed
}

export const useRatingsStore = defineStore('ratings', {
  state: (): InitialState => ({
    ratings: [],
  }),

  getters: {
    getIdeaRatings() {
      return async (ideaId: string) => {
        const response = await RatingService.getAllIdeaRatings(ideaId)

        if (response instanceof Error) {
          return response
        }

        const newIdeaRatings = { ideaId, ideaRatings: response }

        return findOneAndUpdate(this.ratings, newIdeaRatings, {
          key: 'ideaId',
          value: ideaId,
        }).ideaRatings
      }
    },

    getRatingByIdeaIdAndExpertId() {
      return (ideaId: string, expertId: string) => {
        const currentRatings = this.ratings.find(
          (ideaRating) => ideaRating.ideaId === ideaId,
        )?.ideaRatings

        return currentRatings?.find((rating) => rating.expertId === expertId)
      }
    },
  },

  actions: {
    async saveRating(rating: Rating, ideaId: string) {
      const response = await RatingService.saveExpertRating(rating, ideaId)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const currentIdeaRatings = this.ratings.find(
        (ideaRating) => ideaRating.ideaId === ideaId,
      )

      const currentRating = currentIdeaRatings?.ideaRatings.find(
        (ideaRating) => ideaRating.id === rating.id,
      )

      if (currentRating) {
        setIdeaRating(currentRating, rating)
      }
    },

    async confirmRating(rating: Rating, ideaId: string) {
      const response = await RatingService.confirmExpertRating(rating, ideaId)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const currentIdeaRatings = this.ratings.find(
        (ideaRating) => ideaRating.ideaId === ideaId,
      )

      const currentRating = currentIdeaRatings?.ideaRatings.find(
        (ideaRating) => ideaRating.id === rating.id,
      )

      if (currentRating) {
        setIdeaRating(currentRating, { ...rating, isConfirmed: true })
      }

      if (
        currentIdeaRatings?.ideaRatings.every((ideaRating) => ideaRating.isConfirmed)
      ) {
        const ideaRatingsSum = currentIdeaRatings.ideaRatings.reduce(
          (prevSum, ideaRating) =>
            ideaRating.rating ? (prevSum += ideaRating.rating) : prevSum,
          0,
        )
        const ideaExperts = currentIdeaRatings.ideaRatings.length

        useIdeasStore().setIdeaRating(ideaId, ideaRatingsSum / ideaExperts)
      }
    },
  },
})
