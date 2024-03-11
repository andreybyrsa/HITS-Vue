import { Colors } from '@Domain'

export interface LoadingSpinnerProps {
  isLoading: boolean
  className?: string
  variant?: Colors
  size?: 'sm' | 'md'
}
