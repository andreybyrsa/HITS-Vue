interface Idea {
  name: string
  dateCreated: Date
  dateUpdated: Date
  risk: number
  rating: number
  status: 'new' | 'on editing' | 'on approval' | 'on confirmation' | 'confirmed'
}

export default Idea
