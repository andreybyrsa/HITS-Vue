import Team from '@Domain/Team'

interface TeamActionProps {
  team?: Team
}

interface Project {
  id: string
  name: string
  description: string
}

interface TeamActionButtons {
  team: Team
}

export { TeamActionProps, Project, TeamActionButtons }
