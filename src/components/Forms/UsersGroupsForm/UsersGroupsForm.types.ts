import UsersGroup from '@Domain/UsersGroup'

interface GroupsListProps {
  usersGroups?: UsersGroup[]
}

interface GroupListEmits {
  (event: 'openUpdatingGroupModal', usersGroupId: string): void
  (event: 'openDeletingGroupModal', usersGroupId: string): void
}

export { GroupsListProps, GroupListEmits }
