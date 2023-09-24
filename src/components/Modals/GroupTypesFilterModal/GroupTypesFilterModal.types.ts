import RolesTypes from '@Domain/Roles'

interface GroupTypesFilterModalProps {
  isOpened: boolean
  currentFilters: RolesTypes[]
}

interface GroupTypesFilterModalEmits {
  (event: 'close-modal'): void
  (event: 'set-filters', filters: RolesTypes[]): void
}

export { GroupTypesFilterModalProps, GroupTypesFilterModalEmits }
