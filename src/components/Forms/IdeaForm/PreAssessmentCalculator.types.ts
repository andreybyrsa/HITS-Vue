import { OptionType } from '@Components/Inputs/Select/Select.types'

import { Idea } from '@Domain/Idea'

interface PreAssessmentProps {
  idea: Idea
}

interface PreAssessmentSelect {
  name: 'realizability' | 'suitability' | 'budget'
  label: string
  options: OptionType[]
}

const preAssessmentOptions = [
  { label: 'Низкий', value: 1 },
  { label: 'Ниже среднего', value: 2 },
  { label: 'Средний', value: 3 },
  { label: 'Выше среднего', value: 4 },
  { label: 'Высокий', value: 5 },
]

const preAssessmentSelects: PreAssessmentSelect[] = [
  {
    name: 'realizability',
    label: 'Реализуемость*',
    options: preAssessmentOptions,
  },
  {
    name: 'suitability',
    label: 'Пригодность*',
    options: preAssessmentOptions,
  },
  {
    name: 'budget',
    label: 'Бюджет*',
    options: preAssessmentOptions,
  },
]

export { PreAssessmentProps, PreAssessmentSelect, preAssessmentSelects }
