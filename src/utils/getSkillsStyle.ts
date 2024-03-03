import { Skill } from '@Domain'

export function getSkillStyle(skills: Skill[], index: number) {
  const currentSkill = skills[index]
  const initialClass = [
    'px-2',
    'py-1',
    'rounded-4',
    'text-center',
    'align-self-start',
  ]

  if (currentSkill.type === 'LANGUAGE') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }

  if (currentSkill.type === 'FRAMEWORK') {
    initialClass.push('bg-info-subtle', 'text-info')
    return initialClass
  }

  if (currentSkill.type === 'DATABASE') {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }

  if (currentSkill.type === 'DEVOPS') {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }
}
