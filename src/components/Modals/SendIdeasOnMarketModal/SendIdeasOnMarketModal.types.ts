interface SendIdeasOnMarketModalProps {
  isOpened: boolean
}

interface SendIdeasOnMarketModalEmits {
  (event: 'close-modal'): void
  (event: 'send-ideas-on-market'): void
}

export { SendIdeasOnMarketModalProps, SendIdeasOnMarketModalEmits }
