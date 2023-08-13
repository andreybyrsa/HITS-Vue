interface RatingData {
  realizability: number
  suitability: number
  budget: number
}

interface RatingDataEmits {
  (event: 'set-rating', rating: number): void
}

export { RatingData, RatingDataEmits }
