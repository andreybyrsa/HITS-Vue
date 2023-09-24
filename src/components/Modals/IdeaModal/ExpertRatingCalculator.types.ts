import { OptionType } from '@Components/Inputs/Select/Select.types'
import { Idea } from '@Domain/Idea'
interface ExpertRatingData {
  marketValue: number
  originality: number
  technicalRealizability: number
  suitability: number
  budget: number
  rating: number
}
interface RatingSelect {
  name:
    | 'marketValue'
    | 'originality'
    | 'technicalRealizability'
    | 'suitability'
    | 'budget'
  label: string
  options: OptionType[]
  value: any
}
interface ExpertConfirmation {
  rating: number
  marketValue: number
  originality: number
  technicalRealizability: number
  suitability: number
  budget: number
}
interface ExpertData {
  ideaId: string
  expert: string
  rating: number | null
  technicalRealizability: number | null
  suitability: number | null
  budget: number | null
  marketValue: number | null
  originality: number | null
}
interface ExperCalculatorProps {
  idea: Idea
}
const marketValueOptions = [
  { label: 'В идеи полостью описана рыночная ценность', value: 5 },
  { label: 'Инициатор плохо описал рыночную ценность', value: 4 },
  { label: 'Эксперт не увидел рыночной ценности идеи', value: 3 },
  { label: 'Экспер не видит, что рыночная ценность етсь', value: 2 },
  { label: 'Эксперт понимает, что рыночной ценности нет', value: 1 },
]
const originalityOptions = [
  {
    label: 'Подобное решение не встречалось, эксперт полностью понимает инициатора',
    value: 5,
  },
  { label: 'Встречалось похожее решение, инициатор расскрыл идею', value: 4 },
  { label: 'Встречалось похожее решение, инициатор не расскрыл идею', value: 3 },
  { label: 'Решение есть на рынке - ниша занята', value: 2 },
  { label: 'Эксперт не понял инициатора', value: 1 },
]
const technicalRealizabilityOptions = [
  { label: 'Команда уже делала такие проекты', value: 5 },
  { label: 'Есть занания реализации, но нет практического опыта', value: 4 },
  { label: 'Команда делала проекты на альтернативных стеках', value: 3 },
  { label: 'Есть знания в другом стеке, но нет практического опыта', value: 2 },
  { label: 'Нет знаний и опыта', value: 1 },
]
const suitabilityOptions = [
  { label: 'Есть заказчик, инвестор и эксперт в предметной области', value: 5 },
  { label: 'Есть заказчик, инвестор, но нет эксперта', value: 4 },
  { label: 'Есть инвестор, но нет заказчика и эксперта', value: 3 },
  { label: 'Есть заказчик, но нет инвестора и эксперта', value: 2 },
  { label: 'Нет ни заказчика, ни инвестора, ни эксперта', value: 1 },
]
const budgetOptions = [
  { label: 'Не требуется', value: 5 },
  { label: 'До 30.000 руб', value: 4 },
  { label: '30.000 - 50.000 руб', value: 3 },
  { label: '50.000 - 100.000 руб', value: 2 },
  { label: 'Свыше 100.000 руб', value: 1 },
]
const ratingSelects: RatingSelect[] = [
  {
    name: 'marketValue',
    label: 'Рыночная ценность*',
    options: marketValueOptions,
    value: null,
  },
  {
    name: 'originality',
    label: 'Уникальность*',
    options: originalityOptions,
    value: null,
  },
  {
    name: 'technicalRealizability',
    label: 'Реализуемость*',
    options: technicalRealizabilityOptions,
    value: null,
  },
  {
    name: 'suitability',
    label: 'Пригодность*',
    options: suitabilityOptions,
    value: null,
  },
  {
    name: 'budget',
    label: 'Бюджет*',
    options: budgetOptions,
    value: null,
  },
]
export {
  ExpertRatingData,
  RatingSelect,
  ratingSelects,
  ExpertConfirmation,
  ExperCalculatorProps,
  ExpertData,
}
