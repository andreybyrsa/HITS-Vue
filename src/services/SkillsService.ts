import axios from 'axios'

import { API_URL } from '@Main'

import { Skill, SkillType } from '@Domain/Skill'
import { TeamMember } from '@Domain/Team'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { skillsMocks } from '@Utils/getMocks'

const skillsAxios = defineAxios(skillsMocks)

function mockSkillsFormatter(skills: Skill[]) {
  const LANGUAGE = skills.filter((skill) => skill.type === 'LANGUAGE')
  const FRAMEWORK = skills.filter((skill) => skill.type === 'FRAMEWORK')
  const DATABASE = skills.filter((skill) => skill.type === 'DATABASE')
  const DEVOPS = skills.filter((skill) => skill.type === 'DEVOPS')
  return { LANGUAGE, FRAMEWORK, DATABASE, DEVOPS }
}

function mockSkillsByTypeMather(skills: Skill[], type: SkillType) {
  return skills.filter((skill) => skill.type === type)
}

const getAllUsersSkills = async (token: string): Promise<TeamMember[] | Error> => {
  return axios
    .get(`${API_URL}/ideas-service/team/users`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка получения компетенций пользователей'),
    )
}

const getAllSkills = async (token: string): Promise<Skill[] | Error> => {
  return skillsAxios
    .get('/ideas-service/skill/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения компетенций'))
}

const getAllConfirmedOrCreatorSkills = async (
  token: string,
): Promise<Record<SkillType, Skill[]> | Error> => {
  return skillsAxios
    .get<Record<SkillType, Skill[]>>(
      '/ideas-service/skill/all-confirmed-or-creator',
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { formatter: mockSkillsFormatter },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения компетенций'))
}

const getSkillsByType = async (
  skillType: SkillType,
  token: string,
): Promise<Skill[] | Error> => {
  return skillsAxios
    .get<Skill[]>(
      `/ideas-service/skill/${skillType}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { formatter: (data) => mockSkillsByTypeMather(data, skillType) },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения компетенций'))
}

const createSkill = async (skill: Skill, token: string): Promise<Skill | Error> => {
  return skillsAxios
    .post('/ideas-service/skill/add', skill, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления компетенции'))
}

const createNoConfirmedSkill = async (
  skill: Skill,
  token: string,
): Promise<Skill | Error> => {
  return skillsAxios
    .post('/ideas-service/skill/add/no-confirmed', skill, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления компетенции'))
}

const confirmSkill = async (
  skill: Skill,
  id: string,
  token: string,
): Promise<Skill | Error> => {
  return skillsAxios
    .put(
      `/ideas-service/skill/confirm/${id}`,
      skill,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка утверждения компетенции'))
}

const updateSkill = async (
  skill: Skill,
  id: string,
  token: string,
): Promise<Skill | Error> => {
  return skillsAxios
    .put(
      `/ideas-service/skill/update/${id}`,
      skill,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка редактирования компетенции'))
}

const deleteSkill = async (id: string, token: string): Promise<Success | Error> => {
  return skillsAxios
    .delete(
      `/ideas-service/skill/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка удаления компетенции'))
}

const SkillsService = {
  getAllSkills,
  getSkillsByType,
  getAllConfirmedOrCreatorSkills,
  getAllUsersSkills,

  createSkill,
  createNoConfirmedSkill,

  confirmSkill,
  deleteSkill,
  updateSkill,
}

export default SkillsService
