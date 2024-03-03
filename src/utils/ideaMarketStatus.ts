import { IdeaMarketStatusType } from '@Domain'

interface GetIdeaMarketStatusType {
  status: IdeaMarketStatusType[]
  translatedStatus: {
    [key in IdeaMarketStatusType]: string
  }
}

export function getIdeaMarketStatus(): GetIdeaMarketStatusType {
  return {
    status: ['RECRUITMENT_IS_OPEN', 'RECRUITMENT_IS_CLOSED'],
    translatedStatus: {
      RECRUITMENT_IS_OPEN: 'Набор открыт',
      RECRUITMENT_IS_CLOSED: 'Набор закрыт',
    },
  }
}
