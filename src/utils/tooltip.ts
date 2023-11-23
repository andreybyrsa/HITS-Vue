import { DirectiveBinding } from 'vue'
import { Tooltip } from 'bootstrap'

interface TooltipDirective {
  tooltips: { id: string; element: HTMLElement; tooltip: Tooltip }[]
  mounted: (el: HTMLElement, binding: DirectiveBinding) => void
  updated: (el: HTMLElement, binding: DirectiveBinding) => void
}

function createTooltip(element: HTMLElement, binding: DirectiveBinding) {
  const placement = (binding.arg as Tooltip.PopoverPlacement) ?? 'top'
  let customClass = 'custom-tooltip'

  if (binding.modifiers) {
    if (binding.modifiers.red) {
      customClass += ' red-tooltip'
    }
    if (binding.modifiers.blue) {
      customClass += ' blue-tooltip'
    }
    if (binding.modifiers.purple) {
      customClass += ' purple-tooltip'
    }
    if (binding.modifiers.green) {
      customClass += ' green-tooltip'
    }
    if (binding.modifiers.orange) {
      customClass += ' orange-tooltip'
    }
    if (binding.modifiers.yellow) {
      customClass += ' yellow-tooltip'
    }
    if (binding.modifiers.dark) {
      customClass += ' dark-tooltip'
    }
  }

  return new Tooltip(element, {
    placement,
    title: binding.value,
    trigger: 'hover',
    customClass,
    html: true,
  })
}

const tooltipDirective: TooltipDirective = {
  tooltips: [],

  mounted(element: HTMLElement, binding: DirectiveBinding) {
    if (binding.value) {
      const currentTooltip = createTooltip(element, binding)
      const tooltipId = binding.arg ?? 'default'

      tooltipDirective.tooltips.push({
        id: tooltipId,
        element,
        tooltip: currentTooltip,
      })
    }
  },

  updated(element: HTMLElement, binding: DirectiveBinding) {
    const tooltipId = binding.arg ?? 'default'
    const currentElement = tooltipDirective.tooltips.find(
      (tooltip) => tooltip.id === tooltipId && tooltip.element == element,
    )

    if (currentElement && binding.value) {
      currentElement.tooltip.setContent({ '.tooltip-inner': binding.value })
    } else if (binding.value) {
      const currentTooltip = createTooltip(element, binding)

      tooltipDirective.tooltips.push({
        id: tooltipId,
        element,
        tooltip: currentTooltip,
      })
    }
  },
}

export default tooltipDirective
