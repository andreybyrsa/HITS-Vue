import { Skill } from '@Domain/Skill'
import Team from '@Domain/Team'

type mode = 'creating' | 'editing'

interface TeamFormProps {
  team?: Team
  mode: mode
}

interface SkillsRadarChartsProps {
  skills?: Skill[]
  skillsTeam?: Skill[]
  className?: string
}

interface TeamProps {
  mode: mode
}

export { TeamFormProps, SkillsRadarChartsProps, TeamProps }
