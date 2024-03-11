import { MarketStatus } from '@Domain'

interface GetMarketStatusType {
  status: MarketStatus[]
  translatedStatus: {
    [key in MarketStatus]: string
  }
}

export function getMarketStatus(): GetMarketStatusType {
  return {
    status: ['NEW', 'ACTIVE', 'DONE'],
    translatedStatus: {
      NEW: 'Новая',
      ACTIVE: 'Активная',
      DONE: 'Завершена',
    },
  }
}

export function getMarketStatusStyle(status: MarketStatus) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']

  if (status === 'NEW') {
    initialClass.push('bg-primary-subtle', 'text-primary')
    return initialClass
  }

  if (status === 'ACTIVE') {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }

  if (status === 'DONE') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }
}
