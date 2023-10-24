import UsersGroup from '@Domain/UsersGroup'

interface GroupsListProps {
  usersGroups?: UsersGroup[]
}

interface GroupListEmits {
  (event: 'openUpdatingGroupModal', usersGroupId: number): void
  (event: 'openDeletingGroupModal', usersGroupId: number): void
}

export { GroupsListProps, GroupListEmits }
