import { TableColumn } from '@Components/Table/Table.types'
import { TeamAccession } from '@Domain/TeamAccession'

interface TeamAccessionsTableProps {
  columns: TableColumn<TeamAccession>[]
}

export default TeamAccessionsTableProps
