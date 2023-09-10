interface TableColumn {
  key: string
  label: string
  icon?: string
  className?: string
  click?: () => void
  getStyle?: (value: any) => string
  getFormat?: (value: any) => string | number | undefined
}

interface TableProps {
  columns: TableColumn[]
  data: any[]
  searchValue?: string
}

export { TableProps, TableColumn }
