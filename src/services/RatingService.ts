import axios from 'axios'

import { Rating } from '@Domain/Idea'

const RATING_URL = 'http://localhost:3000/api/v1/rating'

const getAllIdeaRatings = async (
  ideaId: string,
  token: string,
): Promise<Rating[] | Error> => {
  return await axios
    .get(`${RATING_URL}/all/${ideaId}`, {
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
  return await axios
    .get(`${RATING_URL}/${ideaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения оценки'
      return new Error(error)
    })
}

const saveExpertRating = async (
  ideaId: string,
  token: string,
): Promise<void | Error> => {
  return await axios
    .put(`${RATING_URL}/save/${ideaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка сохранения оценки'
      return new Error(error)
    })
}

const confirmExpertRating = async (
  ideaId: string,
  token: string,
): Promise<void | Error> => {
  return await axios
    .put(`${RATING_URL}/confirm/${ideaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
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
