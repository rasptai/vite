import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { spawn, ChildProcess } from 'child_process'
const __dirname = import.meta.dirname

let pythonProcess: ChildProcess | null = null

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
    pythonProcess = spawn(join(process.resourcesPath, 'python/python.exe'), [
      join(process.resourcesPath, 'scripts/main.py'),
    ])
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    win.loadURL('http://localhost:5173/')
  }
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

app.on('will-quit', () => {
  if (pythonProcess) {
    pythonProcess.kill()
  }
})
