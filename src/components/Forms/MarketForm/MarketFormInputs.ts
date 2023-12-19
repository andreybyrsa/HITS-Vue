import { MarketInputType } from './MarketForm.types'

const MarketInputs: MarketInputType[] = [
  {
    key: 'name',
    type: 'text',
    name: 'name',
    placeholder: 'Введите название биржи',
  },
  {
    key: 'startDate',
    type: 'date',
    name: 'startDate',
    placeholder: 'Введите дату начала',
  },
  {
    key: 'finishDate',
    type: 'date',
    name: 'finishDate',
    placeholder: 'Введите дату конца',
  },
]

export default MarketInputs
