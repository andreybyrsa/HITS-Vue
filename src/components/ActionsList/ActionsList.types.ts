export type ActionClickFunction<VariableType> = (
  outsideVarible?: VariableType,
) => void

export type ActionStatement<VariableType> =
  | boolean
  | ((outsideVarible: VariableType) => boolean)

export interface Action<VariableType = unknown> {
  label: string
  className?: string
  statement?: ActionStatement<VariableType>
  click: ActionClickFunction<VariableType>
}

export interface ActionsListProps<VariableType> {
  actions: Action<VariableType>[]
  outsideVariable?: VariableType
}
