const electron = require('electron')
const { app, BrowserWindow } = electron

app.on('ready', _ => {
  let win = new BrowserWindow(electron.screen.getPrimaryDisplay().workAreaSize)
  win.loadURL(`file://${__dirname}/index.html`)
  win.on('closed', () => (win = null))
})

app.on('window-all-closed', _ => {
  if (process.platform !== 'dar') {
    app.quit()
  }
})
