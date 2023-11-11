import axios from 'axios'

import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import { Idea } from '@Domain/Idea'
import Project from '@Domain/Project'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import Profile from '@Domain/Profile'

const profileUserAxios = defineAxios(getMocks().profile)
const profileIdeasAxios = defineAxios(getMocks().profileIdeas)
const profileProjectsAxios = defineAxios(getMocks().profileProjects)
const profileSkillsAxios = defineAxios(getMocks().profileSkills)

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
      const error = response?.data?.error ?? 'Ошибка загрузки пользователя'
      return new Error(error)
    })
}

const getProfileSkills = async (
  email: string,
  token: string,
): Promise<Skill[] | Error> => {
  return await profileSkillsAxios
    .get(`/profile/${email}/skills`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки компетенций'
      return new Error(error)
    })
}

const getProfileIdeas = async (
  email: string,
  token: string,
): Promise<Idea[] | Error> => {
  return await profileIdeasAxios
    .get(`/profile/${email}/ideas`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идей'
      return new Error(error)
    })
}

const getProfileProjects = async (
  email: string,
  token: string,
): Promise<Project[] | Error> => {
  return await profileProjectsAxios
    .get(`/profile/${email}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки проектов'
      return new Error(error)
    })
}

const getProfileAvatar = async (
  email: string,
  token: string,
): Promise<string | Error> => {
  return await axios
    .get(`/profile/${email}/avatar`, {
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
  email: string,
  skill: Skill[],
  token: string,
): Promise<Skill[] | Error> => {
  return await profileSkillsAxios
    .post(`/profile/${email}/skills/save`, skill, {
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
  email: string,
  formData: FormData,
  token: string,
): Promise<FormData | Error> => {
  return await axios
    .post(`/profile/${email}/avatar/upload`, formData, {
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
  getProfileSkills,
  getProfileIdeas,
  getProfileProjects,
  getProfileAvatar,

  saveProfileSkills,
  uploadProfileAvatar,
}

export default ProfileService
