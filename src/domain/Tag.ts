interface Tag {
  id: string
  name: string
  color: string
  confirmed: boolean
  creatorId?: string
  updaterId?: string
  deleterId?: string
}

export { Tag }
