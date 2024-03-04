import { Market } from '@Domain'

interface MarketModalInputType {
  type?: string
  name: 'startDate' | 'finishDate' | 'name'
  label: string
  placeholder: string
}

export interface MarketModalProps {
  isOpened: boolean
  market: Market | null
}

export interface MarketModalEmits {
  (event: 'close-modal'): void
}

export const marketModalInputs: MarketModalInputType[] = [
  {
    type: 'text',
    name: 'name',
    label: 'Название',
    placeholder: 'Введите название биржи',
  },
  {
    type: 'date',
    name: 'startDate',
    label: 'Дата старта',
    placeholder: 'Введите дату начала',
  },
  {
    type: 'date',
    name: 'finishDate',
    label: 'Дата окончания',
    placeholder: 'Введите дату конца',
  },
]
