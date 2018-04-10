module.exports = function formatTime (seconds) {
  let remainder = (seconds % (60 * 60))
  let hours = (seconds - remainder) / (60 * 60)

  seconds = remainder

  remainder = (seconds % 60)
  let minutes = (seconds - remainder) / 60

  seconds = remainder

  hours = (hours + '').padStart(2, 0)
  minutes = (minutes + '').padStart(2, 0)
  seconds = (seconds + '').padStart(2, 0)

  return `${hours}:${minutes}:${seconds}`
}
