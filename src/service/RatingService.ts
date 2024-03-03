import { Rating } from '@Domain'
import { defineAxios, ratingsMocks } from '@Utils'

const filterRatingsById = (ideaId: string, ratings: Rating[]) => {
  return ratings.filter((rating) => rating.ideaId === ideaId)
}

const defineApi = defineAxios(ratingsMocks)

const getAllIdeaRatings = async (ideaId: string): Promise<Rating[] | Error> => {
  const response = await defineApi.get<Rating[]>(
    `/rating/all/${ideaId}`,
    {},
    { formatter: (ratings) => filterRatingsById(ideaId, ratings) },
  )
  return response.data
}

const getExpertRating = async (ideaId: string): Promise<Rating | Error> => {
  const response = await defineApi.get(
    `/rating/${ideaId}`,
    {},
    { params: { ideaId } },
  )
  return response.data
}

const saveExpertRating = async (
  rating: Rating,
  ideaId: string,
): Promise<void | Error> => {
  const response = await defineApi.put<void>(
    '/rating/save',
    rating,
    {},
    { params: { ideaId } },
  )
  return response.data
}

const confirmExpertRating = async (
  rating: Rating,
  ideaId: string,
): Promise<void | Error> => {
  const response = await defineApi.put<void>(
    '/rating/confirm',
    rating,
    {},
    { params: { ideaId }, requestData: { ...rating, isConfirmed: true } },
  )
  return response.data
}

export const RatingService = {
  getAllIdeaRatings,
  getExpertRating,
  saveExpertRating,
  confirmExpertRating,
}
