interface ColumnChartProps<OptionType> {
  className?: string

  options: OptionType[]
  displayBy?: keyof OptionType
}

interface ColumnChartBar {
  label: string
  amount: number
  color: string
}

export { ColumnChartProps, ColumnChartBar }
