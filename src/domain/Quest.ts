export interface Category {
  idCategory?: string
  category: string
}

export interface Indicator {
  idIndicator?: string
  value: string
  description: string
  type: string
  role: string
  visible: string
  category: string
}

export interface Quest {
  idQuest?: string
  available: boolean
  name: string
  description: string
}

export interface LaunchQuest {
  idLaunchQuest?: string
  idQuest: string
  idTeam: string
  available: boolean
  startAt: string
  endAt: string
  name: string
  description: string
  indicators: Indicator[]
  passingResult?: string
  passed?: boolean
}

export interface Result {
  idResult?: string
  idIndicator: string
  idLaunchQuest: string
  idFromUser: string
  idToUser: string
  value: string
}

export interface PassedQuest {
  idLaunchQuest?: string
  results: Result[]
}
