import { IdeaMarket, Team, RequestTeamToIdea } from '@Domain'

export interface RequestToIdeaFormProps {
  ideaMarket: IdeaMarket
  requests: RequestTeamToIdea[]
  ownerTeams: Team[]
}

export interface RequestTeamCollapseProps {
  team: Team
  idea: IdeaMarket
  isDisabledButtonSkills?: boolean
}

export const hintLetter =
  'В письме необходимо пояснить, почему именно ваша команда должна быть принята для реализации данной идеи. Основная задача мотивационного письма — выделить команду на фоне других претендентов и продемонстрировать максимальное соответствие требованиям. При подаче заявки в идею важно акцентировать внимание на определённых характеристиках и достижениях команды. С помощью письма инициатор идеи оценивает  — компетенции, опыт и достижения, которые есть у команды на момент заявления.'
