import IdeasMarketStatusTypes from '@Domain/MarketStatus'

interface GetRolesType {
  status: IdeasMarketStatusTypes[]
  translatedStatus: {
    [key in IdeasMarketStatusTypes]: string
  }
}

function getMarketStatus(): GetRolesType {
  return {
    status: ['RECRUITMENT_IS_OPEN', 'RECRUITMENT_IS_CLOSED'],
    translatedStatus: {
      RECRUITMENT_IS_OPEN: 'Набор открыт',
      RECRUITMENT_IS_CLOSED: 'Набор закрыт',
    },
  }
}

export default getMarketStatus
