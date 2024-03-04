import { Skill } from '@Domain'

export interface SkillsProps {
  skills?: Skill[]
  skillActionIcon?: string
}

export interface SkillsEmits {
  (event: 'skill-action', skill: Skill, index: number): void
}
