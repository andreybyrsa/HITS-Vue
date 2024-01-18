interface FinishProjectModalProps {
  isOpened: boolean
}
export default FinishProjectModalProps

interface FinishProjectModalEmits {
  (event: 'close-modal'): void
}
export { FinishProjectModalEmits }
