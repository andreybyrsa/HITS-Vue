import { Sprint } from '@Domain/Project'

interface SprintModalProps {
    isOpened: boolean
    sprint: Sprint | null
}

interface SprintModalEmits {
    (event: 'close-modal'): void
}

export { SprintModalProps, SprintModalEmits }
