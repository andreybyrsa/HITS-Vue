interface RadioProps {
  className?: string
  label?: string
}

interface RadioEmits {
  (event: 'click'): void
}

export { RadioProps, RadioEmits }
