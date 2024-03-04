import axios from 'axios'

import { API_URL } from '@Main'

import { Profile, ProfileFullName } from '@Domain/Profile'
import { Skill } from '@Domain/Skill'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import { profilesMocks, teamsExperienceMocks } from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { TeamExperience } from '@Domain/Team'

const profileUserAxios = defineAxios(profilesMocks)
const teamExperienceAxios = defineAxios(teamsExperienceMocks)

function filterTeamExperienceByUserId(teamExperience: TeamExperience[], id: string) {
  return teamExperience.filter(({ userId }) => userId == id)
}

const getUserProfile = async (
  id: string,
  token: string,
): Promise<Profile | Error> => {
  return profileUserAxios
    .get(
      `/profile/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки профиля'))
}

const getProfileAvatar = async (
  id: string,
  token: string,
): Promise<string | Error> => {
  return axios
    .get(`${API_URL}/profile/avatar/get/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки аватара'))
}

const getTeamExperience = async (
  userId: string,
  token: string,
): Promise<TeamExperience[] | Error> => {
  return teamExperienceAxios
    .get<TeamExperience[]>(
      `${API_URL}/profile/avatar/get`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (teamExperience) =>
          filterTeamExperienceByUserId(teamExperience, userId),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки аватара'))
}

const saveProfileSkills = async (
  skills: Skill[],
  token: string,
): Promise<Skill[] | Error> => {
  return axios
    .post(`${API_URL}/profile/skills/save`, skills, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка сохранения компетенций'))
}

const uploadProfileAvatar = async (
  formData: FormData,
  token: string,
): Promise<string | Error> => {
  return axios
    .post(`${API_URL}/profile/avatar/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка обновления аватара'))
}

const updateUserFullName = async (
  fullName: ProfileFullName,
  token: string,
  id: string,
): Promise<Success | Error> => {
  return axios
    .put(`${API_URL}/profile/update/${id}`, fullName, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения данных'))
}

const ProfileService = {
  getUserProfile,
  getProfileAvatar,
  getTeamExperience,

  saveProfileSkills,
  uploadProfileAvatar,
  updateUserFullName,
}

export default ProfileService
