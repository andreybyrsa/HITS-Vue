import { IdeaMarketStatusType } from '@Domain/IdeaMarket'

interface GetIdeaMarketStatusType {
  status: IdeaMarketStatusType[]
  translatedStatus: {
    [key in IdeaMarketStatusType]: string
  }
}

function getIdeaMarketStatus(): GetIdeaMarketStatusType {
  return {
    status: ['RECRUITMENT_IS_OPEN', 'RECRUITMENT_IS_CLOSED'],
    translatedStatus: {
      RECRUITMENT_IS_OPEN: 'Набор открыт',
      RECRUITMENT_IS_CLOSED: 'Набор закрыт',
    },
  }
}

export default getIdeaMarketStatus
