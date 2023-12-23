import axios from 'axios'

import { API_URL } from '@Main'

import Profile from '@Domain/Profile'
import { Skill } from '@Domain/Skill'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'

const profileUserAxios = defineAxios(getMocks().profiles)

const getUserProfile = async (
  id: string,
  token: string,
): Promise<Profile | Error> => {
  return await profileUserAxios
    .get(
      `/profile/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки профиля'
      return new Error(error)
    })
}

const getProfileAvatar = async (
  id: string,
  token: string,
): Promise<string | Error> => {
  return await axios
    .get(`${API_URL}/profile/avatar/get/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки аватара'
      return new Error(error)
    })
}

const saveProfileSkills = async (
  skills: Skill[],
  token: string,
): Promise<Skill[] | Error> => {
  return await axios
    .post(`${API_URL}/profile/skills/save`, skills, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка сохранения компетенций'
      return new Error(error)
    })
}

const uploadProfileAvatar = async (
  formData: FormData,
  token: string,
): Promise<string | Error> => {
  return await axios
    .post(`${API_URL}/profile/avatar/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка обновления аватара'
      return new Error(error)
    })
}

const ProfileService = {
  getUserProfile,
  getProfileAvatar,

  saveProfileSkills,
  uploadProfileAvatar,
}

export default ProfileService
