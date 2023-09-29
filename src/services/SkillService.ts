import axios from 'axios'

import { Skill, SkillType } from '@Domain/Skill'
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

const getAllConfirmedOrCreatorSkills = async (
  userId: string,
  token: string,
): Promise<Record<SkillType, Skill[]> | Error> => {
  return await axios
    .get(`${SKILLS_URL}/all-confirmed-or-creator/${userId}`, {
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

const updateSkill = async (
  skill: Skill,
  skillId: string,
  token: string,
): Promise<Skill | Error> => {
  return await axios
    .put(`${SKILLS_URL}/update/${skillId}`, skill, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка редактирования компетенции'
      return new Error(error)
    })
}

const deleteSkill = async (
  skillId: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .delete(`${SKILLS_URL}/delete/${skillId}`, {
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
  getAllConfirmedOrCreatorSkills,

  addSkill,
  addNoConfirmedSkill,

  confirmSkill,
  deleteSkill,
  updateSkill,
}

export default SkillsService
