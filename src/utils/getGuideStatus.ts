import { MarketStatus } from '@Domain/Market'
interface GetStatusType {
  status: MarketStatus[]
  translatedStatus: {
    [key in MarketStatus]: string
  }
}
function getGuideStatus(): GetStatusType {
  return {
    status: ['NEW', 'ACTIVE', 'DONE'],
    translatedStatus: {
      NEW: 'Новая',
      ACTIVE: 'Активная',
      DONE: 'Завершена',
    },
  }
}
export default getGuideStatus
