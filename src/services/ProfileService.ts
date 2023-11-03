import axios from 'axios'

import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import { Idea } from '@Domain/Idea'
import Success from '@Domain/ResponseMessage'
import { API_URL } from '../main'

const PROFILE_URL = '/profile'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import { Project } from '@Domain/Project'

const profileIdeasAxios = defineAxios(getMocks().profileIdeas)
const profileProjectsAxios = defineAxios(getMocks().profileProjects)
const profileSkillsAxios = defineAxios(getMocks().profileSkills)

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

const getUserIdeas = async (token: string): Promise<Idea[] | Error> => {
  return await profileIdeasAxios
    .get(`${PROFILE_URL}/ideas/get`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки идей'
      return new Error(error)
    })
}

const getUserProjects = async (token: string): Promise<Project[] | Error> => {
  return await profileProjectsAxios
    .get(`${PROFILE_URL}/projects/get`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки проектов'
      return new Error(error)
    })
}

const getAvatar = async (token: string): Promise<string | Error> => {
  return await axios
    .get(`${PROFILE_URL}/avatar/get`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки аватара'
      return new Error(error)
    })
}

const uploadAvatar = async (
  formData: FormData,
  token: string,
): Promise<FormData | Error> => {
  return await axios
    .post(`${PROFILE_URL}/avatar/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка обновления аватара'
      return new Error(error)
    })
}

const getSkills = async (token: string): Promise<Skill[] | Error> => {
  return await profileSkillsAxios
    .get(`${PROFILE_URL}/skills/get`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки компетенций'
      return new Error(error)
    })
}

const saveSkills = async (skill: Skill[], token: string): Promise<Skill | Error> => {
  return await axios
    .post(`${API_URL}/profile/skills/save`, skill, {
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
  getUserProjects,
  getAvatar,
  uploadAvatar,
  getSkills,
  saveSkills,
}

export default ProfileService
