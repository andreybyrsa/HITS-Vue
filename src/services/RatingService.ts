import { Rating } from '@Domain/Idea'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { ratingsMocks } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

function filterRatingsById(ideaId: string, ratings: Rating[]) {
  return ratings.filter((rating) => rating.ideaId === ideaId)
}

const ratingsAxios = defineAxios(ratingsMocks)

const getAllIdeaRatings = async (
  ideaId: string,
  token: string,
): Promise<Rating[] | Error> => {
  return ratingsAxios
    .get<Rating[]>(
      `/rating/all/${ideaId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { formatter: (ratings) => filterRatingsById(ideaId, ratings) },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения рейтингов'))
}

const getExpertRating = async (
  ideaId: string,
  token: string,
): Promise<Rating | Error> => {
  return ratingsAxios
    .get(
      `/rating/${ideaId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { ideaId } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения рейтинга'))
}

const saveExpertRating = async (
  rating: Rating,
  ideaId: string,
  token: string,
): Promise<void | Error> => {
  return ratingsAxios
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
    .catch((error) => handleAxiosError(error, 'Ошибка сохранения рейтинга'))
}

const confirmExpertRating = async (
  rating: Rating,
  ideaId: string,
  token: string,
): Promise<void | Error> => {
  return ratingsAxios
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
    .catch((error) => handleAxiosError(error, 'Ошибка утверждения рейтинга'))
}

const RatingService = {
  getAllIdeaRatings,
  getExpertRating,

  saveExpertRating,
  confirmExpertRating,
}

export default RatingService
