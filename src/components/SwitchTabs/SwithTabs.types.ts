interface SwitchTab {
  id: string
  label: string
  click: () => void
}

interface SwitchTabsProps {
  tabs: SwitchTab[]
  wrapperClassName?: string
  tabClassName?: string
}

export { SwitchTab, SwitchTabsProps }
