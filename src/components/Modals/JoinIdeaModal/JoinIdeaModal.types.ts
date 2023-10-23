import Market from '@Domain/Market'
import Team from '@Domain/Team'

interface JoinIdeaModalProps {
  isOpened: boolean
}

interface JoinIdeaModalEmits {
  (event: 'close-modal'): void
}

export { JoinIdeaModalProps, JoinIdeaModalEmits }
