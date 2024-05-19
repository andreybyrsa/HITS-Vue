import { Quest, QuestStat } from '@Domain/Quest'

interface InitialState {
  quests: Quest[]
  questsColapseData: QuestStat[]
}

export default InitialState
