interface TableProps {
  columns: {
    key: string
    label: string
    click?: () => void
    getColor?: (value: string | number) => string
  }[]
  data: any[]
  searchValue: string
}

export default TableProps
