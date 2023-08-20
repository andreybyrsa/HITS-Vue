interface RatingData {
  realizability: number
  suitability: number
  budget: number
}

interface RatingCalculatorEmits {
  (event: 'set-rating', rating: number): void
}

export { RatingData, RatingCalculatorEmits }
