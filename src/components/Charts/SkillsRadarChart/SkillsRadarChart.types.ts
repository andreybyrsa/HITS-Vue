import { Skill } from '@Domain/Skill'

interface SkillsForRadar {
  label: string
  skills: Skill[]
  alphaOpacity?: number
}

interface SkillData {
  label: string
  backgroundColor: string
  skills: { label: string; value: number }[]
}

interface SkillsRadarChartsProps {
  skills: SkillsForRadar[]

  className?: string
}

export { SkillsRadarChartsProps, SkillsForRadar, SkillData }
