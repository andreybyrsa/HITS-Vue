import { IdeaMarketStatusType } from '@Domain/IdeaMarket'

interface GetMarketStatusType {
  status: IdeaMarketStatusType[]
  translatedStatus: {
    [key in IdeaMarketStatusType]: string
  }
}

function getMarketStatus(): GetMarketStatusType {
  return {
    status: ['RECRUITMENT_IS_OPEN', 'RECRUITMENT_IS_CLOSED'],
    translatedStatus: {
      RECRUITMENT_IS_OPEN: 'Набор открыт',
      RECRUITMENT_IS_CLOSED: 'Набор закрыт',
    },
  }
}

export default getMarketStatus
