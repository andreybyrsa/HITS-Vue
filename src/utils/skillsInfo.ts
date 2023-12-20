import { SkillType } from '@Domain/Skill'

interface GetSkillType {
  skills: SkillType[]
  translatedSkills: {
    [key in SkillType]: string
  }
}

function getSkillsInfo(): GetSkillType {
  return {
    skills: ['LANGUAGE', 'FRAMEWORK', 'DATABASE', 'DEVOPS'],
    translatedSkills: {
      LANGUAGE: 'Язык разработки',
      FRAMEWORK: 'Фреймворк',
      DATABASE: 'База данных',
      DEVOPS: 'Девопс технология',
    },
  }
}

function getSkillInfoStyle(skillType: SkillType) {
  if (skillType === 'LANGUAGE') {
    return ['bg-success-subtle', 'text-success']
  }

  if (skillType === 'FRAMEWORK') {
    return ['bg-info-subtle', 'text-info']
  }

  if (skillType === 'DATABASE') {
    return ['bg-warning-subtle', 'text-warning']
  }

  return ['bg-danger-subtle', 'text-danger']
}

export { getSkillsInfo, getSkillInfoStyle }
