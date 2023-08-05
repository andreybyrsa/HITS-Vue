function getCurrentDate(testDate: Date) {
  const date = testDate ? new Date(testDate) : new Date()

  const year = date.getFullYear()

  let month: string | number = date.getMonth() + 1
  month = month >= 10 ? month : `0${month}`

  let day: string | number = date.getDate()
  day = day >= 10 ? day : `0${day}`

  let hours: string | number = date.getHours()
  hours = hours >= 10 ? hours : `0${hours}`

  let minutes: string | number = date.getMinutes()
  minutes = minutes >= 10 ? minutes : `0${minutes}`

  return `${day}.${month}.${year} ${hours}:${minutes}`
}

export default getCurrentDate
