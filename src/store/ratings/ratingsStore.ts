import { defineStore } from 'pinia'

import { Rating } from '@Domain/Idea'

import RatingService from '@Services/RatingService'

import InitialState from '@Store/ratings/initialState'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useIdeasStore from '@Store/ideas/ideasStore'

import findOneAndUpdate from '@Utils/findOneAndUpdate'

function setIdeaRating(ideaRating: Rating, newRating: Rating) {
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

const useRatingsStore = defineStore('ratings', {
  state: (): InitialState => ({
    ratings: [],
  }),
  getters: {
    getIdeaRatings() {
      return async (ideaId: string, token: string) => {
        const response = await RatingService.getAllIdeaRatings(ideaId, token)

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
    async saveRating(rating: Rating, ideaId: string, token: string) {
      const response = await RatingService.saveExpertRating(rating, ideaId, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentIdeaRatings = this.ratings.find(
          (ideaRating) => ideaRating.ideaId === ideaId,
        )
        const currentRating = currentIdeaRatings?.ideaRatings.find(
          (ideaRating) => ideaRating.id === rating.id,
        )

        if (currentRating) {
          setIdeaRating(currentRating, rating)
        }
      }
    },

    async confirmRating(rating: Rating, ideaId: string, token: string) {
      const response = await RatingService.confirmExpertRating(rating, ideaId, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
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
          currentIdeaRatings?.ideaRatings.every(
            (ideaRating) => ideaRating.isConfirmed,
          )
        ) {
          const ideaRatingsSum = currentIdeaRatings.ideaRatings.reduce(
            (prevSum, ideaRating) =>
              ideaRating.rating ? (prevSum += ideaRating.rating) : prevSum,
            0,
          )
          const ideaExperts = currentIdeaRatings.ideaRatings.length

          useIdeasStore().setIdeaRating(ideaId, ideaRatingsSum / ideaExperts)
        }
      }
    },
  },
})
export default useRatingsStore
