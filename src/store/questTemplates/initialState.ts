import { QuestTemplate, QuestTemplateShort } from '@Domain/Quest'

interface InitialState {
  questTemplates: QuestTemplateShort[]
  questTemplate: QuestTemplate | null
}

export default InitialState
