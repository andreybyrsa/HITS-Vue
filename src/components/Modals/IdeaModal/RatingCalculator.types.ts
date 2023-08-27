interface RatingData {
  realizability: number
  suitability: number
  budget: number
  rating: number
}

interface RatingSelect {
  label: string
  forName: string
  key: keyof RatingData
}

const ratingSelects: RatingSelect[] = [
  {
    label: 'Реализуемость*',
    forName: 'realizability',
    key: 'realizability',
  },
  {
    label: 'Пригодность*',
    forName: 'suitability',
    key: 'suitability',
  },
  {
    label: 'Бюджет*',
    forName: 'budget',
    key: 'budget',
  },
]

export { RatingData, RatingSelect, ratingSelects }
