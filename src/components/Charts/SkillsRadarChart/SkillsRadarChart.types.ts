import { Skill } from '@Domain'

export interface SkillsArea {
  label: string
  skills: Skill[]
  alphaOpacity?: number
}

export interface UniqueSkill {
  label: string
  value: number
}

export interface SkillsData {
  label: string
  skills: UniqueSkill[]
  backgroundColor: string
}

export interface SkillsRadarChartsProps {
  skills: SkillsArea[]
  className?: string
  width?: number
  height?: number
}
