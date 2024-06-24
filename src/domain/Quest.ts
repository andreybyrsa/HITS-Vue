export interface Category {
  idCategory: string
  category: string
}

export type IndicatorType =
  | 'TEAM'
  | 'INITIATOR'
  | 'MEMBER'
  | 'TEAM_LEADER'
  | 'TEACHER'

export type IndicatorRoleType = 'MEMBER' | 'INITIATOR' | 'TEAM_LEADER' | 'TEACHER'

export interface Indicator {
  id: string
  name: string
  answers: string[]
  type: IndicatorType // кого
  role: IndicatorRoleType // кто оценивает
  visible: boolean
  categoryName: string
  idCategory: string
  // idToUser нужен только на этапе прохождения опроса, при создании indicator его не надо передавать
  idToUser?: string
}

export interface IndicatorCategory {
  idCategory: string
  name: string
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

export interface QuestResultWrapper {
  results: QuestResult[]
}

export interface QuestTeamsProgress {
  teamName: string
  teamProgress: number
}

export interface QuestStat {
  idQuest: string
  isPass: boolean
  idQuestTemplate: string
  name: string
  progress: string
  teams: TeamQuestStat[]
}
export interface TeamQuestStat {
  id: string
  name: string
  progress: string
  users: UsersQuestStat[]
}
export interface UsersQuestStat {
  id: string
  name: string
  progress: boolean
}
