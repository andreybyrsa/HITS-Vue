interface IndicatorModalProps {
  isOpened: boolean
}

interface IndicatorModalEmits {
  (event: 'close-modal'): void
}

export { IndicatorModalProps, IndicatorModalEmits }
