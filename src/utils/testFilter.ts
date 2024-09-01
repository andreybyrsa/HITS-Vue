import { TestFilter } from '@Domain/Test'

interface GetTestFilterType {
  status: TestFilter[]
  translatedStatus: {
    [key in TestFilter]: string
  }
}

function getTestFilter(): GetTestFilterType {
  return {
    status: [
      'ALL',
      'SYNTHETIC',
      'IDEALISTIC',
      'PRAGMATIC',
      'ANALYTICAL',
      'REALISTIC',
    ],
    translatedStatus: {
      ALL: 'Все',
      SYNTHETIC: 'Синтетический',
      IDEALISTIC: 'Идеалистический',
      PRAGMATIC: 'Прагматический',
      ANALYTICAL: 'Аналитический',
      REALISTIC: 'Реалистический',
    },
  }
}

export { getTestFilter }
