import { Action } from '@Components/ActionsList/ActionsList.types'

export interface AdvertisementProps<AdvertisementType> {
  className?: string

  advertisement?: AdvertisementType
  sender: string
  text: string
  createdAt: string
  isActive: boolean

  dropdownActions?: Action<AdvertisementType>[]
  hasAccessToActions?: boolean
}

export interface AdvertisementPlaceholderProps {
  className?: string
}
