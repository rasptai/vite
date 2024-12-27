import { app, BrowserWindow } from "electron";
import { join } from "path";
const __dirname = import.meta.dirname;
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "../preload/preload.mjs"),
      sandbox: false
    }
  });
  if (app.isPackaged) {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  } else {
    win.loadURL("http://localhost:5173/");
  }
  console.log(app.isPackaged);
}
app.whenReady().then(() => createWindow());
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
