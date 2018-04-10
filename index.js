const path = require('path')
const os = require('os')
const formatTime = require('./format-time')
const Recorder = require('./recorder')

const preview = document.getElementById('preview')
const recordDir = document.getElementById('recordDir')
const recordButton = document.getElementById('recordButton')
const durationDisplay = document.getElementById('durationDisplay')
let baseFilename = path.join(os.homedir(), 'Downloads')

recordDir.value = baseFilename

const recorder = new Recorder({
  videoBitsPerSecond: 5000000,
  // File path
  baseFilename,
  // Media contrains
  contraints: {
    video: {
      width: 1280,
      height: 720,
      frameRate: {
        ideal: 30, max: 60
      }
    },
    audio: true
  },
  // Size of chunks in miliseconds
  chunkSize: 10000
})

recorder.on('ready', stream => {
  preview.srcObject = stream
})

recorder.on('recording', isRecording => {
  recordButton.textContent = isRecording ? 'stop' : 'start'
})

recorder.on('duration', duration => {
  durationDisplay.textContent = formatTime(duration)
})

recordButton.addEventListener('click', () => {
  recorder.toggleRecording()
})

recordDir.addEventListener('keyup', e => {
  recorder.baseFilename = e.target.value
})
