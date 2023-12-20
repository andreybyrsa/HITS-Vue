import { Market } from '@Domain/Market'

interface MarketModalInputType {
  type?: string
  name: 'startDate' | 'finishDate' | 'name'
  label: string
  placeholder: string
}

interface MarketModalProps {
  isOpened: boolean
  market: Market | null
}

interface MarketModalEmits {
  (event: 'close-modal'): void
}

const marketModalInputs: MarketModalInputType[] = [
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

export { MarketModalProps, MarketModalEmits, marketModalInputs }
