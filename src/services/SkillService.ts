import axios from 'axios'

import { Skill } from '@Domain/Skill'
import { SkillType } from '@Domain/Skill'
import Success from '@Domain/ResponseMessage'

const SKILLS_URL = 'http://localhost:3000/api/v1/skill'

const getAllSkills = async (token: string): Promise<Skill[] | Error> => {
  return await axios
    .get(`${SKILLS_URL}/all`, {
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
  return await axios
    .get(`${SKILLS_URL}/${skillType}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения компетенций'
      return new Error(error)
    })
}

const addSkill = async (skill: Skill, token: string): Promise<Skill | Error> => {
  return await axios
    .post(`${SKILLS_URL}/add`, skill, {
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
  return await axios
    .post(`${SKILLS_URL}/add/no-confirmed`, skill, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления компетенции'
      return new Error(error)
    })
}

const confirmSkill = async (
  skillId: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .put(`${SKILLS_URL}/confirm/${skillId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка подтверждения компетенции'
      return new Error(error)
    })
}

const deleteSkill = async (
  skillId: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .delete(`${SKILLS_URL}/admin/delete/${skillId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления компетенции'
      return new Error(error)
    })
}

const SkillsService = {
  getAllSkills,
  getSkillsByType,

  addSkill,
  addNoConfirmedSkill,

  confirmSkill,
  deleteSkill,
}

export default SkillsService
