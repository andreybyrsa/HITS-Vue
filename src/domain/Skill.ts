type SkillType = 'LANGUAGE' | 'FRAMEWORK' | 'DATABASE' | 'DEVOPS'

interface Skill {
  id: string
  name: string
  role: SkillType
}

export { Skill, SkillType }
