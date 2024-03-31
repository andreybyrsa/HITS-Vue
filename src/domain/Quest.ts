import RolesTypes from '@Domain/Roles'

export interface Category {
  idCategory: string
  category: string
}

export interface Indicator {
  idIndicator: string
  value: string
  description?: string
  type: 'TEAM' | 'INITIATOR' | 'MEMBER' | 'TEAMLEAD'
  role: RolesTypes
  visible: boolean
  category: string
}

export interface QuestShort {
  idQuest: string
  available: boolean
  name: string
}

export interface Quest extends QuestShort {
  description: string
  indicators: Indicator[]
}

export interface LauchQuest {
  idLaunchQuest: string
  idQuest: string
  idTeam: string
  name: string
  startAt: string
  endAt: string
  available: boolean
  passingResult?: string // процент прохождения командой (можно всем а можно только проектному офису, по усмотрению)
  passed?: boolean // пройдено ли (для членов команды, не для проектного офиса)
}

export interface Result {
  idResult?: string
  idIndicator: string
  idLaunchQuest: string
  idFromUser: string
  idToUser?: string
  value: string
}
