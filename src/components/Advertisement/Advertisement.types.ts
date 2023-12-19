import { Action } from '@Components/ActionsList/ActionsList.types'

interface AdvertisementProps<AdvertisementType> {
  className?: string

  advertisement?: AdvertisementType
  sender: string
  text: string
  createdAt: string
  isActive: boolean

  dropdownActions?: Action<AdvertisementType>[]
  hasAccessToActions?: boolean
}

interface AdvertisementPlaceholderProps {
  className?: string
}

export { AdvertisementProps, AdvertisementPlaceholderProps }
