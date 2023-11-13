import { Skill } from '@Domain/Skill'
import Team from '@Domain/Team'

type mode = 'creating' | 'editing'

interface TeamFormProps {
  team?: Team
  mode: mode
}

interface SkillsForRadar {
  label: string
  skills: Skill[]
}

interface SkillsRadarChartsProps {
  skills: SkillsForRadar[]
  isNotPlaceholder?: boolean

  className?: string
}

interface TeamProps {
  mode: mode
}

export { TeamFormProps, SkillsRadarChartsProps, TeamProps, SkillsForRadar }
