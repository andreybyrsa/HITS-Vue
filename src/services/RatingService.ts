import { Rating } from '@Domain/Idea'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'

const ratingsAxios = defineAxios(getMocks().ratings)

const getAllIdeaRatings = async (
  ideaId: string,
  token: string,
): Promise<Rating[] | Error> => {
  return await ratingsAxios
    .get(`/rating/all/${ideaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения оценок'
      return new Error(error)
    })
}

const getExpertRating = async (
  ideaId: string,
  token: string,
): Promise<Rating | Error> => {
  return await ratingsAxios
    .get(
      `/rating/${ideaId}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { ideaId } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения оценки'
      return new Error(error)
    })
}

const saveExpertRating = async (
  rating: Rating,
  ideaId: string,
  token: string,
): Promise<void | Error> => {
  return await ratingsAxios
    .put<void>(
      `/rating/save/${ideaId}`,
      rating,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { ideaId } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка сохранения оценки'
      return new Error(error)
    })
}

const confirmExpertRating = async (
  rating: Rating,
  ideaId: string,
  token: string,
): Promise<void | Error> => {
  return await ratingsAxios
    .put<void>(
      `/rating/confirm/${ideaId}`,
      rating,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { ideaId }, requestData: { ...rating, confirmed: true } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка утверждения оценки'
      return new Error(error)
    })
}

const RatingService = {
  getAllIdeaRatings,
  getExpertRating,
  saveExpertRating,
  confirmExpertRating,
}

export default RatingService
