import { Quest } from '@Domain/Quest'
import { Team } from '@Domain/Team'

interface Send360QuestProps {
  isOpened: boolean
  teams: Team[]
}

interface Send360QuestEmits {
  (event: 'close-modal'): void
}

export { Send360QuestProps, Send360QuestEmits }
