import { Skill } from '@Domain/Skill'
import Team from '@Domain/Team'
import TeamMember from '@Domain/TeamMember'

interface ProfileSkillChartsProps {
  team: Team
}

interface ProfileSkillChartsEmits {
  (event: 'filter', skill: Skill): void
}

interface TeamStuffProps {
  team: Team
}

interface TeamDescriptionProps {
  team: Team
}

interface TeamDescriptionEmits {
  (event: 'handleKick', member: TeamMember, teamId: number): void
  (event: 'closeModal'): void
}

export {
  ProfileSkillChartsProps,
  ProfileSkillChartsEmits,
  TeamStuffProps,
  TeamDescriptionProps,
  TeamDescriptionEmits,
}
