import { OptionType } from '@Components/Inputs/Select/Select.types'

interface ExpertRatingData {
  marketValue: number
  originality: number
  technicalFeasibility: number
  understanding: number
  realizability: number
  suitability: number
  budget: number
  rating: number
}
interface RatingSelect {
  name:
    | 'marketValue'
    | 'originality'
    | 'technicalFeasibility'
    | 'understanding'
    | 'realizability'
    | 'suitability'
    | 'budget'
  label: string
  forName: string
  key: keyof ExpertRatingData
  options: OptionType[]
}

interface ExpertConfirmation {
  marketValue: number
  originality: number
  technicalFeasibility: number
  understanding: number

  realizability: number
  suitability: number
  budget: number
}

const defaultRatingOptions = [
  { label: 'Высокий', value: 5 },
  { label: 'Выше среднего', value: 4 },
  { label: 'Средний', value: 3 },
  { label: 'Ниже среднего', value: 2 },
  { label: 'Низкий', value: 1 },
]

const ratingSelects: RatingSelect[] = [
  {
    name: 'marketValue',
    label: 'Рыночная ценность*',
    forName: 'marketValue',
    key: 'marketValue',
    options: [
      { label: 'Очень востребована', value: 5 },
      { label: 'Средне востребована', value: 4 },
      { label: 'Имеет некоторую востребованность', value: 3 },
      { label: 'Скорее всего не будет востребована', value: 2 },
      { label: 'Точно не востребована', value: 1 },
    ],
  },
  {
    name: 'originality',
    label: 'Уникальность*',
    forName: 'originality',
    key: 'originality',
    options: [
      { label: 'Точно не было решений', value: 5 },
      { label: 'Скорее всего нет решений', value: 4 },
      { label: 'Решение встречалось в ином виде', value: 3 },
      { label: 'Решение реализуется конкурентами', value: 2 },
      { label: 'Решение уже существует', value: 1 },
    ],
  },
  {
    name: 'technicalFeasibility',
    label: 'Техническая реализуемость*',
    forName: 'technicalFeasibility',
    key: 'technicalFeasibility',
    options: [
      { label: 'Точно реализуемо', value: 5 },
      { label: 'Скорее всего реализуемо', value: 4 },
      { label: 'Возможно реализуемо', value: 3 },
      { label: 'Частично реализуемо', value: 2 },
      { label: 'Не реализуемо', value: 1 },
    ],
  },
  {
    name: 'understanding',
    label: 'Понимание идеи инициатором*',
    forName: 'understanding',
    key: 'understanding',
    options: [
      { label: 'Понимает', value: 5 },
      { label: 'Понимание выше среднего', value: 4 },
      { label: 'Среднее понимание', value: 3 },
      { label: 'Понимание ниже среднего', value: 2 },
      { label: 'Не понимает', value: 1 },
    ],
  },
  {
    name: 'realizability',
    label: 'Реализуемость*',
    forName: 'realizability',
    key: 'realizability',
    options: defaultRatingOptions,
  },
  {
    name: 'suitability',
    label: 'Пригодность*',
    forName: 'suitability',
    key: 'suitability',
    options: defaultRatingOptions,
  },
  {
    name: 'budget',
    label: 'Бюджет*',
    forName: 'budget',
    key: 'budget',
    options: defaultRatingOptions,
  },
]
export { ExpertRatingData, RatingSelect, ratingSelects, ExpertConfirmation }
