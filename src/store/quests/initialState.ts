import { Quest, QuestShort } from '@Domain/Quest'

interface InitialState {
  quests: QuestShort[]
  quest: Quest | null
}

export default InitialState
