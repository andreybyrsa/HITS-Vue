import { DirectiveBinding } from 'vue'
import { Dropdown } from 'bootstrap'
import { onClickOutside } from '@vueuse/core'

interface DropdownDirective {
  dropdowns: { element: HTMLElement; dropdown: Dropdown; isOpen: boolean }[]
  mounted: (el: HTMLElement, binding: DirectiveBinding) => void
  outsideClickHandler?: () => void
  arg?: 'keepOpen'
}

function createDropdown(element: HTMLElement, binding: DirectiveBinding) {
  return new Dropdown(element, {
    display: 'dynamic',
    reference: binding.value,
    popperConfig: null,
  })
}

function сlickHandlher(event: Event) {
  const element = event.currentTarget as HTMLElement
  const currentDropdown = dropdownDirective.dropdowns.find(
    (dropdown) => dropdown.element == element,
  )
  if (currentDropdown) {
    currentDropdown.dropdown.toggle()
    const icon = element.querySelector('i')
    if (!currentDropdown.isOpen) {
      rotateIcon(icon, 180)
      currentDropdown.isOpen = true
    } else {
      rotateIcon(icon, 0)
      currentDropdown.isOpen = false
    }
  }
}

function rotateIcon(icon: HTMLElement | null, degree: number) {
  if (icon) {
    icon.style.transition = 'transform 0.15s'
    icon.style.transform = `rotate(${degree}deg)`
  }
}

const dropdownDirective: DropdownDirective = {
  dropdowns: [],
  mounted(element: HTMLElement, binding: DirectiveBinding) {
    const currentDropdown = createDropdown(element, binding)
    dropdownDirective.dropdowns.push({
      element: element,
      dropdown: currentDropdown,
      isOpen: false,
    })

    element.addEventListener('click', сlickHandlher)

    dropdownDirective.outsideClickHandler = onClickOutside(element, (event) => {
      const dropdownElement =
        binding.arg === 'keepOpen'
          ? (document.getElementById(binding.value) as HTMLElement)
          : null

      const currentDropdown = dropdownDirective.dropdowns.find(
        (dropdown) => dropdown.element == element,
      )

      if (
        !element.contains(event.target as Node) &&
        !dropdownElement?.contains(event.target as Node) &&
        currentDropdown &&
        currentDropdown.isOpen
      ) {
        currentDropdown.dropdown.hide()
        const icon = element.querySelector('i')
        rotateIcon(icon, 0)
        currentDropdown.isOpen = false
      }
    })
  },
}

export default dropdownDirective
