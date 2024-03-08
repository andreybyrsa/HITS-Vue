import { api } from '@Api'
import { Skill, SkillType, TeamMember, Success } from '@Domain'
import { TryCatch, defineAxios, skillsMocks } from '@Utils'

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

export class SkillsService {
  @TryCatch
  static async getAllUsersSkills(): Promise<TeamMember[] | Error> {
    const response = await api.get('/team/users')
    return response.data
  }

  @TryCatch
  static async getAllSkills(): Promise<Skill[] | Error> {
    const response = await defineApi.get('/skill/all')
    return response.data
  }

  @TryCatch
  static async getAllConfirmedOrCreatorSkills(): Promise<
    Record<SkillType, Skill[]> | Error
  > {
    const response = await defineApi.get<Record<SkillType, Skill[]>>(
      '/skill/all-confirmed-or-creator',
      {},
      { formatter: mockSkillsFormatter },
    )
    return response.data
  }

  @TryCatch
  static async getSkillsByType(skillType: SkillType): Promise<Skill[] | Error> {
    const response = await defineApi.get<Skill[]>(
      `/skill/${skillType}`,
      {},
      { formatter: (data) => mockSkillsByTypeMather(data, skillType) },
    )
    return response.data
  }

  @TryCatch
  static async createSkill(skill: Skill): Promise<Skill | Error> {
    const response = await defineApi.post('/skill/add', skill)
    return response.data
  }

  @TryCatch
  static async createNoConfirmedSkill(skill: Skill): Promise<Skill | Error> {
    const response = await defineApi.post('/skill/add/no-confirmed', skill)
    return response.data
  }

  @TryCatch
  static async confirmSkill(skill: Skill, id: string): Promise<Skill | Error> {
    const response = await defineApi.put(
      `/skill/confirm/${id}`,
      skill,
      {},
      { params: { id } },
    )
    return response.data
  }

  @TryCatch
  static async updateSkill(skill: Skill, id: string): Promise<Skill | Error> {
    const response = await defineApi.put(
      `/skill/update/${id}`,
      skill,
      {},
      { params: { id } },
    )
    return response.data
  }

  @TryCatch
  static async deleteSkill(id: string): Promise<Success | Error> {
    const response = await defineApi.delete(
      `/skill/delete/${id}`,
      {},
      { params: { id } },
    )
    return response.data
  }
}
