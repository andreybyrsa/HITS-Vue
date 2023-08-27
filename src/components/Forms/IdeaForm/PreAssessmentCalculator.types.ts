interface PreAssessmentData {
  realizability: number
  suitability: number
  budget: number
  preAssessment: number
}

interface PreAssessmentSelect {
  label: string
  forName: string
  key: keyof PreAssessmentData
}

const preAssessmentSelects: PreAssessmentSelect[] = [
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

export { PreAssessmentData, PreAssessmentSelect, preAssessmentSelects }
