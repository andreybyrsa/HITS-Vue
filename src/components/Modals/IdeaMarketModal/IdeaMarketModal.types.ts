import { VueElement } from 'vue'

import { IdeaMarket } from '@Domain/IdeaMarket'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { Skill } from '@Domain/Skill'
import { Market } from '@Domain/Market'
import { InvitationTeamToIdea } from '@Domain/InvitationTeamToIdea'

interface IdeaMarketModalProps {
  isOpened: boolean
  canGoBack?: boolean
}

interface IdeaMarketDescriptionProps {
  ideaMarket: IdeaMarket
}

interface IdeaMarketTablesProps {
  ideaMarket: IdeaMarket
  requestTeams?: RequestTeamToIdea[]
  invitationsToTeams?: InvitationTeamToIdea[]
}

interface IdeaMarketInfoProps {
  market: Market
  ideaMarket: IdeaMarket
}

interface IdeaMarketCollapseType {
  key: number
  id: number
  ideaKey: keyof IdeaMarket
  text: string
}

interface IdeaMarketTabType {
  id: string
  key: keyof IdeaMarket | keyof Market
  name: string
  icon: string
}

interface IdeaMarketAdvertsProps {
  ideaMarket: IdeaMarket

  ideaMarketModalRef: VueElement | null
}

interface IdeaMarketRightSideProps {
  market: Market
  idea: IdeaMarket
  skills: Skill[]
  skillsTeam?: Skill[]
}

interface IdeaMarketSkillsProps {
  skills: Skill[]
  skillsTeam?: Skill[]
  idea: IdeaMarket
}

interface IdeaMarketModalEmits {
  (event: 'close-modal'): void
}

export {
  IdeaMarketModalProps,
  IdeaMarketDescriptionProps,
  IdeaMarketTablesProps,
  IdeaMarketAdvertsProps,
  IdeaMarketInfoProps,
  IdeaMarketCollapseType,
  IdeaMarketTabType,
  IdeaMarketSkillsProps,
  IdeaMarketRightSideProps,
  IdeaMarketModalEmits,
}
