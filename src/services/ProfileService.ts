import axios from 'axios'

import { API_URL } from '@Main'

import { Profile, ProfileFullName } from '@Domain/Profile'
import { UserTelegram } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import {
  profilesMocks,
  teamsExperienceMocks,
  usersTelegramMocks,
} from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { TeamExperience } from '@Domain/Team'

const profileUserAxios = defineAxios(profilesMocks)
const teamExperienceAxios = defineAxios(teamsExperienceMocks)

function filterTeamExperienceByUserId(teamExperience: TeamExperience[], id: string) {
  return teamExperience.filter(({ userId }) => userId == id)
}
const usersTelegramAxios = defineAxios(usersTelegramMocks)

// --- GET --- //
const getUserProfile = async (
  id: string,
  token: string,
): Promise<Profile | Error> => {
  return profileUserAxios
    .get(
      `/ideas-service/profile/${id}`,
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
    .get(`${API_URL}/ideas-service/profile/avatar/get/${id}`, {
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
      `${API_URL}/ideas-service/profile/avatar/get`,
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

const getUserTelegram = async (
  userId: string,
  token: string,
): Promise<UserTelegram | Error> => {
  return usersTelegramAxios
    .get(
      `/ideas-service/profile/telegram/${userId}`, // fix
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { userId } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки телеграмма'))
}

// --- POST --- //
const saveProfileSkills = async (
  skills: Skill[],
  token: string,
): Promise<Skill[] | Error> => {
  return axios
    .post(`${API_URL}/ideas-service/profile/skills/save`, skills, {
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
    .post(`${API_URL}/ideas-service/profile/avatar/upload`, formData, {
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
): Promise<Profile[] | Error> => {
  return profileUserAxios
    .put<Profile[]>(
      `/ideas-service/profile/update`,
      fullName,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id: fullName.id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения данных'))
}

const createUserTelegram = async (
  userTelegram: UserTelegram,
  token: string,
): Promise<UserTelegram | Error> => {
  return usersTelegramAxios
    .postNoRequestBody<UserTelegram>(
      `${API_URL}/ideas-service/profile/telegram/add-tag`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        requestData: userTelegram,
      },
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка создания пользователя Телеграм'),
    )
}

// --- PUT --- //
const updateTelegramTag = async (
  userTelegram: UserTelegram,
  userId: string,
  token: string,
): Promise<Success | Error> => {
  return usersTelegramAxios
    .put<Success>(
      `${API_URL}/ideas-service/profile/telegram/update/`,
      userTelegram,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { userId } },
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка обновления Телеграм-тега пользователя'),
    )
}

const updateVisibilityOfTag = async (
  userTag: string,
  isVisible: boolean,
  token: string,
): Promise<Success | Error> => {
  return usersTelegramAxios
    .putNoRequestBody<Success>(
      `${API_URL}/ideas-service/profile/telegram/visibility/${userTag}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { isVisible } },
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(
        error,
        'Ошибка обновления видимости Телеграм-тега пользователя',
      ),
    )
}

// --- DELETE --- //
const deleteUserTelegram = async (
  userTag: string,
  token: string,
): Promise<Success | Error> => {
  return usersTelegramAxios
    .delete(
      `${API_URL}/ideas-service/profile/telegram/delete/${userTag}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { userTag } },
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка удаления пользователя Телеграм'),
    )
}

const ProfileService = {
  getUserProfile,
  getProfileAvatar,
  getTeamExperience,
  getUserTelegram,

  saveProfileSkills,
  uploadProfileAvatar,
  updateUserFullName,
  createUserTelegram,

  updateTelegramTag,
  updateVisibilityOfTag,

  deleteUserTelegram,
}

export default ProfileService
