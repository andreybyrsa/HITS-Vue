interface TaskInfoTabsType {
  content: string
  header: string
  icon?: string
}

const TaskInfoTabs: TaskInfoTabsType[] = [
  {
    content: 'initiator',
    header: 'Постановщик',
    icon: 'bi bi-person-circle',
  },
  {
    content: 'executor',
    header: 'Исполнитель',
    icon: 'bi bi-person-circle',
  },
  {
    content: 'workHour',
    header: 'Трудоемкость',
    icon: 'bi bi-clock',
  },
]

export default TaskInfoTabs
