interface PreAssessmentData {
  realizability: number
  suitability: number
  budget: number
  preAssessment: number
}

interface PreAssessmentSelect {
  name: 'realizability' | 'suitability' | 'budget'
  label: string
  forName: string
  key: keyof PreAssessmentData
}

const preAssessmentSelects: PreAssessmentSelect[] = [
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

export { PreAssessmentData, PreAssessmentSelect, preAssessmentSelects }
