import { OptionType } from '@Components/Inputs/Select/Select.types'
import { Idea } from '@Domain'

export interface PreAssessmentProps {
  idea: Idea
}

export interface PreAssessmentSelect {
  name: 'suitability' | 'budget'
  label: string
  options: OptionType[]
}

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

export const preAssessmentSelects: PreAssessmentSelect[] = [
  {
    name: 'suitability',
    label: 'Пригодность*',
    options: suitabilityOptions,
  },
  {
    name: 'budget',
    label: 'Бюджет*',
    options: budgetOptions,
  },
]
