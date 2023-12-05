import { Collapse } from 'bootstrap'
import { DirectiveBinding } from 'vue'

interface CollapseDirective {
  collapses: { element: HTMLElement; collapse: Collapse; isOpen: boolean }[]
  mounted: (el: HTMLElement, binding: DirectiveBinding) => void
}

function createCollapse(element: HTMLElement, binding: DirectiveBinding) {
  const collapse = new Collapse(
    document.getElementById(binding.value) as HTMLElement,
    {
      parent: element,
      toggle: false,
    },
  )

  if (binding.arg === 'openOnMount') {
    collapse.toggle()
  }

  return collapse
}

function rotateIcon(icon: HTMLElement | null, degree: number) {
  if (icon) {
    icon.style.transition = 'transform 0.15s'
    icon.style.transform = `rotate(${degree}deg)`
  }
}

function clickHandler(event: Event, iconIsRotate: boolean) {
  const element = event.currentTarget as HTMLElement
  const currentCollapse = collapseDirective.collapses?.find(
    (collapse) => collapse.element == element,
  )
  if (currentCollapse) {
    currentCollapse.collapse.toggle()
    const icon = element.querySelector('i')
    if (!currentCollapse.isOpen) {
      if (iconIsRotate) {
        rotateIcon(icon, 180)
      }
      currentCollapse.isOpen = true
    } else {
      if (iconIsRotate) {
        rotateIcon(icon, 180)
      }
      currentCollapse.isOpen = false
    }
  }
}
const collapseDirective: CollapseDirective = {
  collapses: [],
  mounted(element: HTMLElement, binding: DirectiveBinding) {
    const currentCollapse = createCollapse(element, binding)
    collapseDirective.collapses.push({
      element: element,
      collapse: currentCollapse,
      isOpen: false,
    })
    element.addEventListener('click', (event) =>
      clickHandler(event, binding.arg === 'rotate-icon'),
    )
  },
}

export default collapseDirective
