import TeamMember from '@Domain/TeamMember'

interface TeamDescriptionEmits {
  (event: 'closeModal'): void
}

interface TeamMemberInfoProps {
  member: TeamMember
}

export { TeamDescriptionEmits, TeamMemberInfoProps }
