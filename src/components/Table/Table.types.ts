import { Filter } from '@Components/FilterBar/FilterBar.types'

type KeyValueFunction<T, K extends keyof T> = (
  value: T[K],
  ...args: number[]
) => void

type TypedStyleFunction<T> = { [K in keyof T]-?: KeyValueFunction<T, K> }[keyof T]
type TypedFormatFunction<T> = { [K in keyof T]-?: KeyValueFunction<T, K> }[keyof T]

type ColumnSize =
  | 'col'
  | 'col-1'
  | 'col-2'
  | 'col-3'
  | 'col-4'
  | 'col-5'
  | 'col-6'
  | 'col-7'
  | 'col-8'

interface CheckedDataAction<DataType> {
  label: string
  className?: string
  statement?: boolean
  click: (values: DataType[]) => void
}

interface DropdownMenuAction<DataType> {
  label: string
  className?: string
  statement?: (data: DataType) => boolean
  click: (value: DataType) => void
}

interface TableColumn<DataType> {
  key: keyof DataType
  label: string
  size?: ColumnSize
  contentClassName?: string
  getRowCellStyle?: TypedStyleFunction<DataType>
  getRowCellFormat?: TypedFormatFunction<DataType>
  headerCellClick?: () => void
  rowCellClick?: (value: DataType) => void
}

interface TableProps<DataType> {
  columns: TableColumn<DataType>[]
  data: DataType[]
  searchBy?: keyof DataType
  filters?: Filter<DataType>[]
  checkedDataActions?: CheckedDataAction<DataType>[]
  dropdownActionsMenu?: DropdownMenuAction<DataType>[]
}

export {
  TableProps,
  TableColumn,
  TypedFormatFunction,
  TypedStyleFunction,
  CheckedDataAction,
  DropdownMenuAction,
}
