interface ExpertRatingData {
  marketValue: number
  originality: number
  technicalFeasibility: number
  understanding: number
  rating: number
}
interface RatingSelect {
  label: string
  forName: string
  key: keyof ExpertRatingData
  choices: { label: string; value: number }[]
}
const ratingSelects: RatingSelect[] = [
  {
    label: 'Рыночная ценность*',
    forName: 'marketValue',
    key: 'marketValue',
    choices: [
      { label: 'Очень востребована', value: 5 },
      { label: 'Не очень востребована', value: 3.75 },
      { label: 'Скорее всего не будет востребована', value: 2.5 },
      { label: 'Точно не востребована', value: 1.25 },
    ],
  },
  {
    label: 'Уникальность*',
    forName: 'originality',
    key: 'originality',
    choices: [
      { label: 'Решение есть', value: 5 },
      { label: 'Решение встречалось', value: 3.75 },
      { label: 'Скорее всего нет решений', value: 2.5 },
      { label: 'Точно не было', value: 1.25 },
    ],
  },
  {
    label: 'Техническая реализуемость*',
    forName: 'technicalFeasibility',
    key: 'technicalFeasibility',
    choices: [
      { label: 'Точно существует', value: 5 },
      { label: 'Скорее всего существует', value: 3.75 },
      { label: 'Возможно существует', value: 2.5 },
      { label: 'Не существует', value: 1.25 },
    ],
  },
  {
    label: 'Понимание идеи инициатором*',
    forName: 'understanding',
    key: 'understanding',
    choices: [
      { label: 'Понимает', value: 5 },
      { label: 'Понимание среднее', value: 3.75 },
      { label: 'Понимание ниже среднего', value: 2.5 },
      { label: 'Не понимает', value: 1.25 },
    ],
  },
]
export { ExpertRatingData, RatingSelect, ratingSelects }
