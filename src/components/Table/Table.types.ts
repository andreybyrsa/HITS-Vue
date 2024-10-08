import { ButtonProps } from '@Components/Button/Button.types'
import { Filter } from '@Components/FilterBar/FilterBar.types'
import { StyleValue, defineComponent } from 'vue'

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
  beforeLabel?: string
  statementLabel?: (data: DataType) => boolean
  className?: string
  statement?: (data: DataType) => boolean
  click: (value: DataType) => void
}

interface HeaderButton extends ButtonProps {
  label: string
  statement?: boolean
  click: () => void
}

interface TableHeader {
  label: string
  countData?: boolean
  buttons?: HeaderButton[]
}

interface TableColumn<DataType> {
  key: keyof DataType
  label?: string
  size?: ColumnSize
  contentClassName?: string
  getRowCellStyleCSS?: (value: DataType[keyof DataType]) => StyleValue
  getRowCellStyle?: TypedStyleFunction<DataType>
  getRowCellFormat?: TypedFormatFunction<DataType>
  headerCellClick?: () => void
  rowCellClick?: (value: DataType) => void
}

interface TableProps<DataType> {
  className?: string
  header?: TableHeader
  columns: TableColumn<DataType>[]
  data: DataType[]
  searchBy?: (keyof DataType)[]
  filters?: Filter<DataType>[]
  callback?: Promise<void> | undefined
  checkedDataActions?: CheckedDataAction<DataType>[]
  dropdownActionsMenu?: DropdownMenuAction<DataType>[]
  chevronAction?: ($event?: undefined) => any
  isCheckbox?: boolean
  collapseChildComponent?: ReturnType<typeof defineComponent> // в этом компоненте должен быть СТРОГО ОДИН пропс "data"
}

export {
  TableProps,
  TableHeader,
  TableColumn,
  TypedFormatFunction,
  TypedStyleFunction,
  CheckedDataAction,
  DropdownMenuAction,
}
