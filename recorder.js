const path = require('path')
const EventEmitter = require('events')
const fs = require('fs')

function getTime () {
  const date = new Date()
  return date.getUTCMonth() + '-' +
    date.getUTCDate() + '-' +
    date.getUTCHours() + '-' +
    date.getUTCMinutes() + '-' +
    date.getUTCSeconds()
}

class Recorder extends EventEmitter {
  constructor ({videoBitsPerSecond, baseFilename, contraints, chunkSize}) {
    super()
    this.videoBitsPerSecond = videoBitsPerSecond
    this.baseFilename = baseFilename
    this.recorder = null
    this.chunksCount = 0
    this.chunkSize = chunkSize
    this.duration = 0
    this.intervalId = null
    this.filename = getTime()

    navigator.mediaDevices.getUserMedia(contraints).then(localStream => {
      this.localStream = localStream
      this.emit('ready', localStream)
    })
  }
  startTimer () {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    } else {
      this.intervalId = setInterval(() => {
        this.duration++
        this.emit('duration', this.duration)
      }, 1000)
      this.emit('duration', this.duration)
    }
  }
  toggleRecording () {
    if (this.recorder === null) {
      this.recorder = new MediaRecorder(this.localStream, {
        videoBitsPerSecond: this.videoBitsPerSecond
      })
      this.recorder.ondataavailable = e => {
        this.chunksCount++
        this.save([e.data])
      }
      this.recorder.start(this.chunkSize)
    } else {
      this.recorder.stop()
      this.recorder = null
    }
    this.emit('recording', this.recorder !== null)
    this.startTimer()
  }
  save (chunks) {
    console.log(`Converting ${chunks.length} new chunk(s)`)
    const blob = new Blob(chunks)
    let fr = new FileReader()
    fr.readAsArrayBuffer(blob)
    fr.onload = () => {
      const buffer = Buffer.from(fr.result)
      const filename = path.join(this.baseFilename, this.filename + '.webm')
      console.log(`Writing file of ${buffer.length} 'bytes to ${filename}`)
      if (this.recorder === null) {
        this.filename = getTime()
      }
      fs.appendFile(filename, buffer, err => {
        if (err) {
          console.error(err)
          console.log('Saved file')
        }
      })
    }
  }
}

module.exports = Recorder
