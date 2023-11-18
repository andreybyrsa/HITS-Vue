import Team from '@Domain/Team'

type mode = 'creating' | 'editing'

interface TeamFormProps {
  team?: Team
  mode: mode
}

interface TeamProps {
  mode: mode
}

export { TeamFormProps, TeamProps }
