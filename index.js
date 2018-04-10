const preview = document.getElementById('preview')
const recordButton = document.getElementById('recordButton')
const Recorder = require('./recorder')

const recorder = new Recorder({
  videoBitsPerSecond: 5000000,
  // File path
  baseFilename: `/Users/austinkurpuis/Downloads/`,
  // Media contrains
  contraints: {
    video: true,
    audio: true
  },
  // Size of chunks in miliseconds
  chunkSize: 5000
})

recorder.on('ready', stream => {
  preview.srcObject = stream
})

recorder.on('recording', isRecording => {
  recordButton.textContent = isRecording ? 'stop' : 'start'
})

recordButton.addEventListener('click', () => {
  recorder.toggleRecording()
})
