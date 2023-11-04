import IdeasMarket from '@Domain/IdeasMarket'

const marketModalCollapses: MarketModalCollapseType[] = [
  { key: 0, id: 0, ideaKey: 'problem', text: 'Проблема' },
  { key: 1, id: 1, ideaKey: 'solution', text: 'Предлагаемое решение' },
  { key: 2, id: 2, ideaKey: 'result', text: 'Ожидаемый результат' },
  {
    key: 3,
    id: 3,
    ideaKey: 'description',
    text: 'Описание необходимых ресурсов для реализации',
  },
]

interface MarketModalCollapseType {
  key: number
  id: number
  ideaKey: keyof IdeasMarket
  text: string
}

export default marketModalCollapses
