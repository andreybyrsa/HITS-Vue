interface IconProps {
  id?: string
  className?: string

  isCollapseController?: boolean
  isDropDownController?: boolean
  dropDownClickableInside?: boolean
}

interface IconEmits {
  (event: 'click'): void
}

export { IconProps, IconEmits }
