import { ref } from 'vue'

function useTimer(initialSeconds: number) {
  const expiredTime = ref('')

  const intervalID = setInterval(() => {
    const minutes = Math.floor(initialSeconds / 60)
    const seconds = initialSeconds - minutes * 60

    const currentMinutes = minutes.toString().length > 1 ? minutes : `0${minutes}`
    const currentSeconds = seconds.toString().length > 1 ? seconds : `0${seconds}`

    expiredTime.value = `${currentMinutes}:${currentSeconds}`

    if (initialSeconds > 0) {
      initialSeconds--
    } else {
      clearInterval(intervalID)
    }
  }, 1000)

  return expiredTime
}

export default useTimer
