import { Skill, SkillType } from '@Domain/Skill'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import UsersSkills from '@Domain/UsersSkills'

const skillsAxios = defineAxios(getMocks().skills)
const usersSkillsAxois = defineAxios(getMocks().usersSkills)

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

const getAllUsersSkills = async (token: string): Promise<UsersSkills[] | Error> => {
  return await usersSkillsAxois
    .get('all/users/skills', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error =
        response?.data?.error ?? 'Ошибка получения компетенций пользователей'
      return new Error(error)
    })
}

const getAllSkills = async (token: string): Promise<Skill[] | Error> => {
  return await skillsAxios
    .get('/skill/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
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
  return await skillsAxios
    .get<Record<SkillType, Skill[]>>(
      '/skill/all-confirmed-or-creator',
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { formatter: mockSkillsFormatter },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения компетенций'
      return new Error(error)
    })
}

const getSkillsByType = async (
  skillType: SkillType,
  token: string,
): Promise<Skill[] | Error> => {
  return await skillsAxios
    .get<Skill[]>(
      `/skill/${skillType}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { formatter: (data) => mockSkillsByTypeMather(data, skillType) },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения компетенций'
      return new Error(error)
    })
}

const createSkill = async (skill: Skill, token: string): Promise<Skill | Error> => {
  return await skillsAxios
    .post('/skill/add', skill, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления компетенции'
      return new Error(error)
    })
}

const createNoConfirmedSkill = async (
  skill: Skill,
  token: string,
): Promise<Skill | Error> => {
  return await skillsAxios
    .post('/skill/add/no-confirmed', skill, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
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
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
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
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
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
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
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
  getAllUsersSkills,

  createSkill,
  createNoConfirmedSkill,

  confirmSkill,
  deleteSkill,
  updateSkill,
}

export default SkillsService
