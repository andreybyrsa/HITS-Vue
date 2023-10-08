import { Skill } from '@Domain/Skill'
import Team from '@Domain/Team'

interface TeamModalProps {
  isOpened: boolean

  team?: Team
}

interface TeamModalEmits {
  (event: 'close-modal'): void
}
interface ProfileSkillChartsProps {
  team: Team
}

interface ProfileSkillChartsEmits {
  (event: 'filter', skill: Skill): void
}
export {
  TeamModalProps,
  TeamModalEmits,
  ProfileSkillChartsProps,
  ProfileSkillChartsEmits,
}
