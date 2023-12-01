import { Skill } from '@Domain/Skill'

interface SkillsArea {
  label: string
  skills: Skill[]
  alphaOpacity?: number
}

interface UniqueSkill {
  label: string
  value: number
}

interface SkillsData {
  label: string
  skills: UniqueSkill[]
  backgroundColor: string
}

interface SkillsRadarChartsProps {
  skills: SkillsArea[]

  className?: string
  width?: number
  height?: number
}

export { SkillsRadarChartsProps, SkillsArea, SkillsData, UniqueSkill }
