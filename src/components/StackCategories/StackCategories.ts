import { Skill, SkillType } from '@Domain/Skill'

interface StackCategoriesProps {
  skills?: Skill[]
}

interface StackCategories {
  id: string
  key: SkillType
  placeholder: string
  multiselectPlaceholder: string
}

const comboboxStackCategories: StackCategories[] = [
  {
    id: '0',
    key: 'LANGUAGE',
    placeholder: 'Языки разработки',
    multiselectPlaceholder: 'Языки разработки',
  },
  {
    id: '1',
    key: 'FRAMEWORK',
    placeholder: 'Фреймворки',
    multiselectPlaceholder: 'Фреймворки',
  },
  {
    id: '2',
    key: 'DATABASE',
    placeholder: 'Базы данных',
    multiselectPlaceholder: 'Базы данных',
  },
  {
    id: '3',
    key: 'DEVOPS',
    placeholder: 'DevOps технологии',
    multiselectPlaceholder: 'DevOps',
  },
]

export { StackCategoriesProps, comboboxStackCategories }
