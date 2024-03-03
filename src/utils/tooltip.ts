import { DirectiveBinding } from 'vue'
import { Tooltip } from 'bootstrap'

interface TooltipDirective {
  tooltips: { element: HTMLElement; tooltip: Tooltip }[]
  mounted: (el: HTMLElement, binding: DirectiveBinding) => void
  updated: (el: HTMLElement, binding: DirectiveBinding) => void
}

function createTooltip(element: HTMLElement, binding: DirectiveBinding) {
  const placement = (binding.arg as Tooltip.PopoverPlacement) ?? 'top'
  return new Tooltip(element, {
    placement,
    title: binding.value,
    trigger: 'hover',
    customClass: 'custom-tooltip',
    html: true,
  })
}

export const tooltipDirective: TooltipDirective = {
  tooltips: [],

  mounted(element: HTMLElement, binding: DirectiveBinding) {
    if (binding.value) {
      const currentTooltip = createTooltip(element, binding)
      tooltipDirective.tooltips.push({ element, tooltip: currentTooltip })
    }
  },

  updated(element: HTMLElement, binding: DirectiveBinding) {
    const currentElement = tooltipDirective.tooltips.find(
      (tooltip) => tooltip.element == element,
    )

    if (currentElement && binding.value) {
      currentElement.tooltip.setContent({ '.tooltip-inner': binding.value })
    } else if (binding.value) {
      const currentTooltip = createTooltip(element, binding)
      tooltipDirective.tooltips.push({ element, tooltip: currentTooltip })
    }
  },
}
