export type InitialState<FormType> = FormType

export interface AdvertisementsFormProps<FormType> {
  title: string
  initialState: InitialState<FormType>
  hasAccessToSend: boolean
  inputPlaceholder: string
  handleSendAdvertisement: (value: InitialState<FormType>) => Promise<void>
}
