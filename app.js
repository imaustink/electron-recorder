const electron = require('electron')
const { app, BrowserWindow } = electron

app.on('ready', _ => {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  let win = new BrowserWindow({ width, height })
  win.loadURL(`file://${__dirname}/index.html`)
  win.on('closed', () => (win = null))
})

app.on('window-all-closed', _ => {
  if (process.platform !== 'dar') {
    app.quit()
  }
})
