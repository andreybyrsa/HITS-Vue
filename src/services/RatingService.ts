import { Rating } from '@Domain/Idea'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'

function filterRatingsById(ideaId: string, ratings: Rating[]) {
  return ratings.filter((rating) => rating.ideaId === ideaId)
}

const ratingsAxios = defineAxios(getMocks().ratings)

const getAllIdeaRatings = async (
  ideaId: string,
  token: string,
): Promise<Rating[] | Error> => {
  return await ratingsAxios
    .get<Rating[]>(
      `/rating/all/${ideaId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { formatter: (ratings) => filterRatingsById(ideaId, ratings) },
    )
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
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
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
      '/rating/save',
      rating,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
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
      '/rating/confirm',
      rating,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { ideaId }, requestData: { ...rating, isConfirmed: true } },
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
