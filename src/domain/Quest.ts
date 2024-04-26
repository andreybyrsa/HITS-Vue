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
  nameCategory?: string
  idCategory?: string
  // idToUser нужен только на этапе прохождения опроса, при создании indicator его не надо передавать
  idToUser?: string
}

export interface QuestShort {
  idQuest?: string
  available?: boolean
  name: string
}

export interface Quest extends QuestShort {
  description: string
  indicators: Indicator[]
}

export interface LaunchQuest {
  idLaunchQuest: string
  idQuest: string
  idTeams: string[]
  name: string
  startAt: string
  endAt: string
  available?: boolean
  passingResult?: string // процент прохождения командой (можно всем а можно только проектному офису, по усмотрению)
  passed?: boolean // пройдено ли (для членов команды, не для проектного офиса)
}

export interface QuestResult {
  idResult?: string
  idIndicator: string
  idLaunchQuest: string
  idFromUser: string
  idToUser?: string
  value: string
}
