type SkillType = 'LANGUAGE' | 'FRAMEWORK' | 'DATABASE' | 'DEVOPS'

interface Skill {
  id: string
  name: string
  type: SkillType
  confirmed: boolean
}

export { Skill, SkillType }
