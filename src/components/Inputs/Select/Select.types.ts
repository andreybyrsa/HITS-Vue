interface OptionType {
  value: string | number | boolean
  label: string
}

interface SelectProps {
  className?: string
  labelClassName?: string
  label?: string
  defaultValue?: string | number
  options?: OptionType[]
}

export default SelectProps
