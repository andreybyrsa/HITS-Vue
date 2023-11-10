import IdeasMarket from '@Domain/IdeasMarket'
import ApplicationTeams from '@Domain/RequestTeams'
import { Skill } from '@Domain/Skill'

interface MarketModalProps {
  isOpened: boolean
}

interface MarketDescriptionProps {
  idea: IdeasMarket
}

interface MarketModalEmits {
  (event: 'close-modal'): void
}

interface MarketAcceptTeamProps {
  teams?: ApplicationTeams[]
  idea?: IdeasMarket
}

interface MarketInfoProps {
  idea: IdeasMarket
}

interface MarketSkillsradarChartsProps {
  skills?: Skill[]
  skillsTeam?: Skill[]
}

export {
  MarketModalProps,
  MarketDescriptionProps,
  MarketModalEmits,
  MarketAcceptTeamProps,
  MarketInfoProps,
  MarketSkillsradarChartsProps,
}
