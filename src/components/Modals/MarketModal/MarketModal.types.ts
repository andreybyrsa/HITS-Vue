import Market from '@Domain/Market'

interface MarketModalProps {
  isOpened: boolean
}

interface MarketDescriptionProps {
  idea: Market
}

interface MarketModalEmits {
  (event: 'close-modal'): void
}

export { MarketModalProps, MarketDescriptionProps, MarketModalEmits }
