import { Sprint } from '@Domain/Project'

interface SprintChartModalProps {
  isOpened: boolean
  sprint: Sprint
}

interface SprintChartModalEmits {
  (event: 'close-modal'): void
}

export { SprintChartModalProps, SprintChartModalEmits }
