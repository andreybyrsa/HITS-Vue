type SkillType = 'LANGUAGE' | 'FRAMEWORK' | 'DATABASE' | 'DEVOPS'

interface Skill {
  id: number
  name: string
  type: SkillType
  confirmed: boolean
  creatorId?: string
  updaterId?: string
  deleterId?: string
}

export { Skill, SkillType }
