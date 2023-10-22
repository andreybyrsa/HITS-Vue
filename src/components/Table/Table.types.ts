import RolesTypes from '@Domain/Roles'

interface TableColumn<DataType> {
  key: string
  label: string
  icon?: string
  className?: string
  click?: () => void
  getStyle?: (value: DataType[keyof DataType]) => string
  getFormat?: (value: DataType[keyof DataType]) => string | number | undefined
}

interface TableProps<DataType> {
  columns: TableColumn<DataType>[]
  data: DataType[]
  searchValue?: string

  buttons?: {
    label: string
    click: (value: DataType[]) => void
    statement: boolean
  }[]
}

export { TableProps, TableColumn }
