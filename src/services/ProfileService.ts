import axios from 'axios'

import Profile from '@Domain/Profile'
import { Skill } from '@Domain/Skill'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'

const profileUserAxios = defineAxios(getMocks().profiles)

const getUserProfile = async (
  email: string,
  token: string,
): Promise<Profile | Error> => {
  return await profileUserAxios
    .get(
      `/profile/${email}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { email } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки профиля'
      return new Error(error)
    })
}

const getProfileAvatar = async (
  email: string,
  token: string,
): Promise<string | Error> => {
  return await axios
    .get(`/profile/avatar/get/${email}`, {
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
    .post('/profile/skills/save', skills, {
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
): Promise<FormData | Error> => {
  return await axios
    .post(`/profile/avatar/upload`, formData, {
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
