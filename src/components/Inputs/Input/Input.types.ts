interface InputProps {
  className?: string
  type?: string
  error?: string
  placeholder?: string
  prepend?: string
  append?: string
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

export { InputProps, HTMLInputEvent }
