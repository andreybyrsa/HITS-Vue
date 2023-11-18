import { Skill } from '@Domain/Skill'

interface SkillsForRadar {
  label: string
  skills: Skill[]
}

interface SkillsRadarChartsProps {
  skills: SkillsForRadar[]
  isNotPlaceholder?: boolean

  className?: string
}

export { SkillsRadarChartsProps, SkillsForRadar }
