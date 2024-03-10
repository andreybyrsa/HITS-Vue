import { Skill, SkillType } from '@Domain'

export interface StackCategoriesProps {
  label?: string
  skills?: Skill[]
  hint?: string
}

interface StackCategories {
  id: string
  key: SkillType
  placeholder: string
  multiselectPlaceholder: string
}

export const comboboxStackCategories: StackCategories[] = [
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
