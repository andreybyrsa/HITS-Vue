import { Market, MarketStatus } from '@Domain/Market'

interface MarketInputType {
  key: 'startDate' | 'finishDate' | 'name'
  type?: string
  name: 'startDate' | 'finishDate' | 'name'
  placeholder: string
  prepend?: string
  prependIcon?: string
}

interface MarketFormProps {
  market?: Market
}

interface MarketFormEmits {
  (event: 'close-form'): void
}

export { MarketInputType, MarketFormProps, MarketFormEmits }
