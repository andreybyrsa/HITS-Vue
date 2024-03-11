export type SkillType = 'LANGUAGE' | 'FRAMEWORK' | 'DATABASE' | 'DEVOPS'

export interface Skill {
  id: string
  name: string
  type: SkillType
  confirmed: boolean
  creatorId?: string
  updaterId?: string
  deleterId?: string
}
