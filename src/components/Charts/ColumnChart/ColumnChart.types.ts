export interface ColumnChartProps<OptionType> {
  className?: string
  options: OptionType[]
  displayBy?: keyof OptionType
}

export interface ColumnChartBar {
  label: string
  amount: number
  color: string
}
