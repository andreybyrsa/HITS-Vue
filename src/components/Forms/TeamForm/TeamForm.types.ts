import { Skill, Team } from '@Domain'

export interface TeamFormProps {
  team?: Team
}

export interface SkillsRadarChartsProps {
  skills: Skill[]
  className?: string
}

export interface TeamProps {
  team?: Team
}

export interface TeamEmits {
  (
    event: 'set-value',
    field: keyof Team,
    value: string | number,
    shouldValidate?: boolean,
  ): void
}
