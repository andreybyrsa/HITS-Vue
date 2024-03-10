import { Rating } from '@Domain'
import { TryCatch, defineAxios, ratingsMocks } from '@Utils'

const filterRatingsById = (ideaId: string, ratings: Rating[]) => {
  return ratings.filter((rating) => rating.ideaId === ideaId)
}

const defineApi = defineAxios(ratingsMocks)

export class RatingService {
  @TryCatch
  static async getAllIdeaRatings(ideaId: string): Promise<Rating[] | Error> {
    const response = await defineApi.get<Rating[]>(
      `/rating/all/${ideaId}`,
      {},
      { formatter: (ratings) => filterRatingsById(ideaId, ratings) },
    )
    return response.data
  }

  @TryCatch
  static async getExpertRating(ideaId: string): Promise<Rating | Error> {
    const response = await defineApi.get(
      `/rating/${ideaId}`,
      {},
      { params: { ideaId } },
    )
    return response.data
  }

  @TryCatch
  static async saveExpertRating(
    rating: Rating,
    ideaId: string,
  ): Promise<void | Error> {
    const response = await defineApi.put<void>(
      '/rating/save',
      rating,
      {},
      { params: { ideaId } },
    )
    return response.data
  }

  @TryCatch
  static async confirmExpertRating(
    rating: Rating,
    ideaId: string,
  ): Promise<void | Error> {
    const response = await defineApi.put<void>(
      '/rating/confirm',
      rating,
      {},
      { params: { ideaId }, requestData: { ...rating, isConfirmed: true } },
    )
    return response.data
  }
}
