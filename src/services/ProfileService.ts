import axios from 'axios'

import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import { Idea } from '@Domain/Idea'
import Success from '@Domain/ResponseMessage'

const PROFILE_URL = 'http://localhost:3000/api/v1/profile'

// const getProfile = async (token: string): Promise<User[] | Error> => {
//   return await axios
//     .get(`${PROFILE_URL}/all`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//     .then((response) => response.data)
//     .catch(({ response }) => {
//       const error = response?.data?.error ?? 'Ошибка получения профиля'
//       return new Error(error)
//     })
// }

const getUserIdeas = async (token: string): Promise<Idea | Error> => {
  return await axios
    .get(`${PROFILE_URL}/get/ideas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идей'
      return new Error(error)
    })
}

const getAvatar = async (token: string): Promise<string | Error> => {
  return await axios
    .get(`${PROFILE_URL}/get/avatar`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки аватарки'
      return new Error(error)
    })
}

const uploadAvatar = async (
  formData: FormData,
  token: string,
): Promise<FormData | Error> => {
  return await axios
    .post(`${PROFILE_URL}/upload/avatar`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка обновления аватарки'
      return new Error(error)
    })
}

const getSkills = async (token: string): Promise<Skill | Error> => {
  return await axios
    .get(`${PROFILE_URL}/get/skills`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки компетенций'
      return new Error(error)
    })
}

const saveSkills = async (token: string): Promise<void | Error> => {
  return await axios
    .put(`${PROFILE_URL}/save/skills`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка сохранения компетенций'
      return new Error(error)
    })
}

const ProfileService = {
  getUserIdeas,
  getAvatar,
  uploadAvatar,
  getSkills,
  saveSkills,
}

export default ProfileService
