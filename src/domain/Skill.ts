type SkillType = 'LANGUAGE' | 'FRAMEWORK' | 'DATABASE' | 'DEVOPS'

interface Skill {
  id: string
  name: string
  type: SkillType
  status: string
}

export { Skill, SkillType }
