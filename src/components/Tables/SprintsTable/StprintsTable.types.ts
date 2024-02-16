import { Sprint, Task } from '@Domain/Project'

interface SprintsTableProps {
  sprint: Sprint[]
  projectId: string
  tasks?: Task[]
}

export default SprintsTableProps
