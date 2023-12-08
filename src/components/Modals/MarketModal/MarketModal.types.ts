import IdeaMarket from '@Domain/IdeaMarket'
import RequestTeamToIdea from '@Domain/RequestTeamToIdea'
import { Skill } from '@Domain/Skill'

interface MarketModalProps {
  isOpened: boolean
}

interface MarketDescriptionProps {
  idea: IdeaMarket
}

interface MarketTablesProps {
  acceptedTeams?: RequestTeamToIdea[]
  requestTeams?: RequestTeamToIdea[]
}

interface MarketModalEmits {
  (event: 'close-modal'): void
}

interface MarketAcceptTeamProps {
  teams?: RequestTeamToIdea[]
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
  MarketTablesProps,
  MarketModalEmits,
  MarketAcceptTeamProps,
  MarketInfoProps,
  MarketSkillsradarChartsProps,
  MarketRightSideProps,
}
