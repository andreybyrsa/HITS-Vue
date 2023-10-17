interface TableColumn<DataType> {
  key: string
  label: string
  icon?: string
  className?: string
  click?: () => void
  getStyle?: (value: DataType) => string
  getFormat?: (value: DataType) => string | number | undefined
}

interface TableProps<DataType> {
  columns: TableColumn<DataType>[]
  data: DataType[]
  searchValue?: string
}

export { TableProps, TableColumn }
