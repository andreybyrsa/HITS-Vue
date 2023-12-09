import IdeaMarket from '@Domain/IdeaMarket'

interface IdeaCardProps {
  idea: IdeaMarket
  isAllIdeas: boolean
}

interface IdeaCardEmits {
  (event: 'send-quick-request', idea: IdeaMarket): void
}

export { IdeaCardProps, IdeaCardEmits }
