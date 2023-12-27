type InitialState<FormType> = FormType

interface AdvertisementsFormProps<FormType> {
  title: string
  initialState: InitialState<FormType>

  hasAccessToSend: boolean
  inputPlaceholder: string
  handleSendAdvertisement: (value: InitialState<FormType>) => Promise<void>
}

export { AdvertisementsFormProps, InitialState }
