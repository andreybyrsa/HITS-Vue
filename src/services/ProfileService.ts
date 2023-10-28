import axios from 'axios'

import Profile from '@Domain/Profile'

const PROFILE_URL = 'http://localhost:3000/api/v1/profile'

const getProfile = async (token: string): Promise<Profile | Error> => {
  return await axios
    .get(`${PROFILE_URL}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения профиля'
      return new Error(error)
    })
}

const getAllProfiles = async (token: string): Promise<Profile[] | Error> => {
  return await axios
    .get(`${PROFILE_URL}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения профиля'
      return new Error(error)
    })
}

const ProfileService = {
  getProfile,
  getAllProfiles,
}

export default ProfileService
