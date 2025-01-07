import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { execFile } from 'child_process'
const __dirname = import.meta.dirname

// ウィンドウを作成する関数
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.mjs'),
      sandbox: false,
    },
  })
  if (app.isPackaged) {
    execFile(join(process.resourcesPath, 'main.exe'), (err) => {
      if (err) console.error(err)
    })
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    win.loadURL('http://localhost:5173/')
  }
  console.log(app.isPackaged)
}

// アプリケーションが準備できたらウィンドウを作成
app.whenReady().then(() => createWindow()) // whenReady() は Promise を返すので、then() でコールバックを登録

// 全てのウィンドウが閉じられたらアプリケーションを終了
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // macOSはウィンドウが閉じられても終了しない
    app.quit()
  }
})
