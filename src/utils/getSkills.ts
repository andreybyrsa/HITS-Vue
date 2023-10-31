import { SkillType } from '@Domain/Skill'

interface GetSkillType {
  skills: SkillType[]
  translatedSkills: {
    [key in SkillType]: string
  }
}

function getStatus(): GetSkillType {
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

export default getStatus
