function getCurrentDate(ideaDate: Date) {
  const date = ideaDate ? new Date(ideaDate) : new Date()

  const year = date.getFullYear()

  const month = date.getMonth() + 1
  const currentMonth = month >= 10 ? month : `0${month}`

  const day = date.getDate()
  const currentDay = day >= 10 ? day : `0${day}`

  const hours = date.getHours()
  const currentHours = hours >= 10 ? hours : `0${hours}`

  const minutes = date.getMinutes()
  const currentMinutes = minutes >= 10 ? minutes : `0${minutes}`

  return `${currentDay}.${currentMonth}.${year} ${currentHours}:${currentMinutes}`
}

export default getCurrentDate
