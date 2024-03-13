import { Sprint, Task } from '@Domain/Project'

interface FinishSprintModalProps {
  isOpened: boolean
  isFinishSprint?: boolean
  activeSprint: Sprint
  activeTask?: Task
}

interface sprintValidationProps {
  report: string
  radio: boolean
}

interface FinishSprintModalEmits {
  (event: 'close-modal'): void
}

export { FinishSprintModalEmits, FinishSprintModalProps, sprintValidationProps }
