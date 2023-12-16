type ActionClickFunction<VariableType> = (outsideVarible?: VariableType) => void

type ActionStatement<VariableType> =
  | boolean
  | ((outsideVarible: VariableType) => boolean)

interface Action<VariableType = unknown> {
  label: string
  className?: string
  statement?: ActionStatement<VariableType>
  click: ActionClickFunction<VariableType>
}

interface ActionsListProps<VariableType> {
  actions: Action<VariableType>[]
  outsideVariable?: VariableType
}

export { ActionsListProps, Action, ActionClickFunction, ActionStatement }
