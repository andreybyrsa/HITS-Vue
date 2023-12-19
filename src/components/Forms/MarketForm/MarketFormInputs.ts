import { MarketInputType } from './MarketForm.types'

const MarketInputs: MarketInputType[] = [
  {
    key: 'name',
    type: 'text',
    name: 'name',
    placeholder: 'Введите название биржи',
    // prepend: '@',
  },
  {
    key: 'startDate',
    type: 'date',
    name: 'startDate',
    placeholder: 'Введите дату начала',
    // prependIcon: 'bi bi-key',
  },
  {
    key: 'finishDate',
    type: 'date',
    name: 'finishDate',
    placeholder: 'Введите дату конца',
    // prependIcon: 'bi bi-key',
  },
]

export default MarketInputs
