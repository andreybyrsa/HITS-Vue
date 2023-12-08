import IdeaMarket from '@Domain/IdeaMarket'
import ApplicationTeams from '@Domain/RequestTeamToIdea'
import { Skill } from '@Domain/Skill'

interface MarketModalProps {
  isOpened: boolean
}

interface MarketDescriptionProps {
  idea: IdeaMarket
}

interface MarketModalEmits {
  (event: 'close-modal'): void
}

interface MarketAcceptTeamProps {
  teams?: ApplicationTeams[]
  idea?: IdeaMarket
}

interface MarketInfoProps {
  idea: IdeaMarket
}

interface MarketRightSideProps {
  idea: IdeaMarket
  skills: Skill[]
  skillsTeam?: Skill[]
}

interface MarketSkillsradarChartsProps {
  skills: Skill[]
  skillsTeam?: Skill[]
  idea: IdeaMarket
}

export {
  MarketModalProps,
  MarketDescriptionProps,
  MarketModalEmits,
  MarketAcceptTeamProps,
  MarketInfoProps,
  MarketSkillsradarChartsProps,
  MarketRightSideProps,
}
