import { Market } from '@Domain/Market'

interface MarketModalInputType {
  type?: string
  name: 'startDate' | 'finishDate' | 'name'
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
    placeholder: 'Введите название биржи',
  },
  {
    type: 'date',
    name: 'startDate',
    placeholder: 'Введите дату начала',
  },
  {
    type: 'date',
    name: 'finishDate',
    placeholder: 'Введите дату конца',
  },
]

export { MarketModalProps, MarketModalEmits, marketModalInputs }
