import { api } from '@Api'
import { Skill, SkillType, TeamMember, Success } from '@Domain'
import { defineAxios, skillsMocks } from '@Utils'

const defineApi = defineAxios(skillsMocks)

const mockSkillsFormatter = (skills: Skill[]) => {
  const LANGUAGE = skills.filter((skill) => skill.type === 'LANGUAGE')
  const FRAMEWORK = skills.filter((skill) => skill.type === 'FRAMEWORK')
  const DATABASE = skills.filter((skill) => skill.type === 'DATABASE')
  const DEVOPS = skills.filter((skill) => skill.type === 'DEVOPS')
  return { LANGUAGE, FRAMEWORK, DATABASE, DEVOPS }
}

const mockSkillsByTypeMather = (skills: Skill[], type: SkillType) => {
  return skills.filter((skill) => skill.type === type)
}

const getAllUsersSkills = async (): Promise<TeamMember[] | Error> => {
  const response = await api.get('/team/users')
  return response.data
}

const getAllSkills = async (): Promise<Skill[] | Error> => {
  const response = await defineApi.get('/skill/all')
  return response.data
}

const getAllConfirmedOrCreatorSkills = async (): Promise<
  Record<SkillType, Skill[]> | Error
> => {
  const response = await defineApi.get<Record<SkillType, Skill[]>>(
    '/skill/all-confirmed-or-creator',
    {},
    { formatter: mockSkillsFormatter },
  )
  return response.data
}

const getSkillsByType = async (skillType: SkillType): Promise<Skill[] | Error> => {
  const response = await defineApi.get<Skill[]>(
    `/skill/${skillType}`,
    {},
    { formatter: (data) => mockSkillsByTypeMather(data, skillType) },
  )
  return response.data
}

const createSkill = async (skill: Skill): Promise<Skill | Error> => {
  const response = await defineApi.post('/skill/add', skill)
  return response.data
}

const createNoConfirmedSkill = async (skill: Skill): Promise<Skill | Error> => {
  const response = await defineApi.post('/skill/add/no-confirmed', skill)
  return response.data
}

const confirmSkill = async (skill: Skill, id: string): Promise<Skill | Error> => {
  const response = await defineApi.put(
    `/skill/confirm/${id}`,
    skill,
    {},
    { params: { id } },
  )
  return response.data
}

const updateSkill = async (skill: Skill, id: string): Promise<Skill | Error> => {
  const response = await defineApi.put(
    `/skill/update/${id}`,
    skill,
    {},
    { params: { id } },
  )
  return response.data
}

const deleteSkill = async (id: string): Promise<Success | Error> => {
  const response = await defineApi.delete(
    `/skill/delete/${id}`,
    {},
    { params: { id } },
  )
  return response.data
}

export const SkillsService = {
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
