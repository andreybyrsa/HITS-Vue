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
}

const ratingSelects: RatingSelect[] = [
  {
    name: 'realizability',
    label: 'Реализуемость*',
    forName: 'realizability',
    key: 'realizability',
  },
  {
    name: 'suitability',
    label: 'Пригодность*',
    forName: 'suitability',
    key: 'suitability',
  },
  {
    name: 'budget',
    label: 'Бюджет*',
    forName: 'budget',
    key: 'budget',
  },
]

export { RatingData, RatingSelect, ratingSelects }
