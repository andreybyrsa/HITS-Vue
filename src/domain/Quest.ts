import RolesTypes from '@Domain/Roles'

export interface Category {
  idCategory: string
  category: string
}

export type IndicatorType = 'TEAM' | 'INITIATOR' | 'TEAM-MEMBER' | 'TEAMLEAD'
// export type IndicatorType = 'SCORE' | 'TEAM-MEMBERS'

export interface Indicator {
  idIndicator: string
  name: string
  description?: string
  type: IndicatorType
  role: RolesTypes
  visible: boolean
  categoryName?: string
  idCategory?: string
  // idToUser нужен только на этапе прохождения опроса, при создании indicator его не надо передавать
  idToUser?: string
}

export interface QuestTemplateShort {
  idQuestTemplate: string
  available?: boolean
  name: string
}

export interface QuestTemplate extends QuestTemplateShort {
  description: string
  indicators: Indicator[]
}

export interface Quest {
  idQuest: string
  idQuestTemplate: string
  idTeams: { id: string }[]
  name: string
  startAt: string
  endAt: string
  available: boolean
  percent?: string // процент прохождения
  passed?: boolean // пройдено ли (для членов команды, не для проектного офиса)
}

export interface QuestResult {
  idResult?: string
  idIndicator: string
  idQuest: string
  idFromUser: string
  idToUser?: string
  value: string
}

export interface QuestTeamsProgress {
  teamName: string
  teamProgress: number
}
