import axios from 'axios'

import { API_URL } from '@Main'

import { Skill, SkillType } from '@Domain/Skill'
import Success from '@Domain/ResponseMessage'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'

const skillsAxios = defineAxios(getMocks().skills)
const axiosInstance = axios.create({ baseURL: API_URL })

const getAllSkills = async (token: string): Promise<Skill[] | Error> => {
  return await skillsAxios
    .get('/skill/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения компетенций'
      return new Error(error)
    })
}

const getAllConfirmedOrCreatorSkills = async (
  token: string,
): Promise<Record<SkillType, Skill[]> | Error> => {
  return await axiosInstance
    .get('/skill/all-confirmed-or-creator', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения компетенций'
      return new Error(error)
    })
}

const getSkillsByType = async (
  skillType: string,
  token: string,
): Promise<Skill[] | Error> => {
  return await skillsAxios
    .get(`/skill/${skillType}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения компетенций'
      return new Error(error)
    })
}

const addSkill = async (skill: Skill, token: string): Promise<Skill | Error> => {
  return await skillsAxios
    .post('/skill/add', skill, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления компетенции'
      return new Error(error)
    })
}

const addNoConfirmedSkill = async (
  skill: Skill,
  token: string,
): Promise<Skill | Error> => {
  return await skillsAxios
    .post('/skill/add/no-confirmed', skill, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления компетенции'
      return new Error(error)
    })
}

const confirmSkill = async (
  skill: Skill,
  id: string,
  token: string,
): Promise<Skill | Error> => {
  return await skillsAxios
    .put(
      `/skill/confirm/${id}`,
      skill,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка подтверждения компетенции'
      return new Error(error)
    })
}

const updateSkill = async (
  skill: Skill,
  id: string,
  token: string,
): Promise<Skill | Error> => {
  return await skillsAxios
    .put(
      `/skill/update/${id}`,
      skill,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка редактирования компетенции'
      return new Error(error)
    })
}

const deleteSkill = async (id: string, token: string): Promise<Success | Error> => {
  return await skillsAxios
    .delete(
      `/skill/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления компетенции'
      return new Error(error)
    })
}

const SkillsService = {
  getAllSkills,
  getSkillsByType,
  getAllConfirmedOrCreatorSkills,

  addSkill,
  addNoConfirmedSkill,

  confirmSkill,
  deleteSkill,
  updateSkill,
}

export default SkillsService
