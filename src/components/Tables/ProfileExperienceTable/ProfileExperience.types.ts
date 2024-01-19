import { Profile } from '@Domain/Profile'
import { ProjectMember } from '@Domain/Project'

interface TeamsExperience {
  profile: Profile
}

interface TeamProjectsProps {
  projects: ProjectMember[]
}

export { TeamsExperience, TeamProjectsProps }
