interface SendDataModalProps<DataType> {
  data: DataType[]
  buttons: {
    label: string
    click: (value: DataType[]) => void
    statement: boolean
  }[]
}

export default SendDataModalProps
