import { Skill } from '@Domain/Skill'

interface SkillsProps {
  skills?: Skill[]
  skillActionIcon?: string
}

interface SkillsEmits {
  (event: 'skill-action', skill: Skill, index: number): void
}

export { SkillsProps, SkillsEmits }
