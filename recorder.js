const EventEmitter = require('events')
const fs = require('fs')

class Recorder extends EventEmitter {
  constructor ({videoBitsPerSecond, baseFilename, contraints, chunkSize}) {
    super()
    this.videoBitsPerSecond = videoBitsPerSecond
    this.baseFilename = baseFilename
    this.recorder = null
    this.chunksCount = 0
    this.chunkSize = chunkSize

    navigator.mediaDevices.getUserMedia(contraints).then(localStream => {
      this.localStream = localStream
      this.emit('ready', localStream)
    })
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
  }
  save (chunks) {
    console.log(`Converting ${chunks.length} new chunk(s)`)
    const blob = new Blob(chunks)
    let fr = new FileReader()
    fr.readAsArrayBuffer(blob)
    fr.onload = () => {
      const date = new Date()
      const buffer = Buffer.from(fr.result)
      const filename = this.baseFilename + date.getUTCMonth() + '-' + date.getUTCDate() + '-' + date.getUTCHours() + '-' + date.getUTCMinutes() + '.webm'
      console.log(`Writing file of ${buffer.length} 'bytes to ${filename}`)
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
