interface LoadingSpinnerProps {
  isLoading: boolean

  className?: string
  type?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'light'
    | 'dark'
  size?: 'sm' | 'md'
}

export default LoadingSpinnerProps
