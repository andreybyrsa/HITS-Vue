import { Skill } from '@Domain/Skill'
import { Team } from '@Domain/Team'
interface TeamFormProps {
  team?: Team
}
interface SkillsRadarChartsProps {
  skills: Skill[]
}
export { TeamFormProps, SkillsRadarChartsProps }
