import { Skill } from '@Domain/Skill'
import { Team } from '@Domain/Team'

interface TeamFormProps {
  team?: Team
}
interface SkillsRadarChartsProps {
  skills: Skill[]
  className?: string
}

interface TeamProps {
  team?: Team
}

interface TeamEmits {
  (
    event: 'set-value',
    field: keyof Team,
    value: string | number,
    shouldValidate?: boolean,
  ): void
}

export { TeamFormProps, SkillsRadarChartsProps, TeamProps, TeamEmits }
