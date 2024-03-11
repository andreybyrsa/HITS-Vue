import { VueElement } from 'vue'
import {
  IdeaMarket,
  RequestTeamToIdea,
  Skill,
  Market,
  InvitationTeamToIdea,
} from '@Domain'

export interface IdeaMarketModalProps {
  isOpened: boolean
  canGoBack?: boolean
}

export interface IdeaMarketDescriptionProps {
  ideaMarket: IdeaMarket
}

export interface IdeaMarketTablesProps {
  ideaMarket: IdeaMarket
  requestTeams?: RequestTeamToIdea[]
  invitationsToTeams?: InvitationTeamToIdea[]
}

export interface IdeaMarketInfoProps {
  market: Market
  ideaMarket: IdeaMarket
}

export interface IdeaMarketCollapseType {
  key: number
  id: number
  ideaKey: keyof IdeaMarket
  text: string
}

export interface IdeaMarketTabType {
  id: string
  key: keyof IdeaMarket | keyof Market
  name: string
  icon: string
}

export interface IdeaMarketAdvertsProps {
  ideaMarket: IdeaMarket

  ideaMarketModalRef: VueElement | null
}

export interface IdeaMarketRightSideProps {
  market: Market
  idea: IdeaMarket
  skills: Skill[]
  skillsTeam?: Skill[]
}

export interface IdeaMarketSkillsProps {
  skills: Skill[]
  skillsTeam?: Skill[]
  idea: IdeaMarket
}

export interface IdeaMarketModalEmits {
  (event: 'close-modal'): void
}
