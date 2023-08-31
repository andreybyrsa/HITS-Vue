import { OptionType } from '@Components/Inputs/Select/Select.types'

interface RatingData {
  realizability: number
  suitability: number
  budget: number
  rating: number
}

interface RatingSelect {
  name: 'realizability' | 'suitability' | 'budget'
  label: string
  forName: string
  key: keyof RatingData
  options: OptionType[]
}

const ratingOptions = [
  { label: 'Высокий', value: 5 },
  { label: 'Выше среднего', value: 4 },
  { label: 'Средний', value: 3 },
  { label: 'Ниже среднего', value: 2 },
  { label: 'Низкий', value: 1 },
]

const ratingSelects: RatingSelect[] = [
  {
    name: 'realizability',
    label: 'Реализуемость*',
    forName: 'realizability',
    key: 'realizability',
    options: ratingOptions,
  },
  {
    name: 'suitability',
    label: 'Пригодность*',
    forName: 'suitability',
    key: 'suitability',
    options: ratingOptions,
  },
  {
    name: 'budget',
    label: 'Бюджет*',
    forName: 'budget',
    key: 'budget',
    options: ratingOptions,
  },
]

export { RatingData, RatingSelect, ratingSelects }
