interface ProjectInfoTabsType {
  content: string
  header: string
  icon: string
}

const ProjectInfoTabs: ProjectInfoTabsType[] = [
  {
    content: 'initiator',
    header: 'Инициатор',
    icon: 'bi bi-person-circle',
  },
  {
    content: 'customer',
    header: 'Заказчик',
    icon: 'bi bi-person-circle',
  },
  {
    content: 'startDate',
    header: 'Дата старта',
    icon: 'bi bi-calendar',
  },
  {
    content: 'finishData',
    header: 'Дата окончания',
    icon: 'bi bi-calendar-check',
  },
]

export default ProjectInfoTabs
