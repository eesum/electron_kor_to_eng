const { app, BrowserWindow, globalShortcut, Tray, Menu, ipcMain } = require('electron')
const { autoConvert, autoConvertLine, autoConvertSelection, engToKorSelection, korToEngSelection } = require('./features');
const { engToKor, korToEng } = require('./convertType');
const path = require('path');

let win;
let tray = null;

const createWindow = () => {
  if (win) {
    win.show();
    return;
  }

  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  win.on('closed', () => {
    win = null;
  });
}

function createTray() {
  if (!tray) {

    tray = new Tray(path.join(__dirname, 'icon.png'));

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Auto Convert Last Word',
        accelerator: 'CmdOrCtrl+Shift+P',
        click: () => {
          autoConvert();
        }
      },
      {
        label: 'Auto Convert Current Line',
        accelerator: 'CmdOrCtrl+Shift+L',
        click: () => {
          autoConvertLine();
        }
      },
      {
        label: 'Auto Convert Selection',
        accelerator: 'CmdOrCtrl+Shift+X',
        click: () => {
          autoConvertSelection();
        }
      },
      {
        label: 'ENG to KOR Selection',
        accelerator: 'CmdOrCtrl+Shift+E',
        click: () => {
          engToKorSelection();
        }
      },
      {
        label: 'KOR to ENG Selection',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: () => {
          korToEngSelection();
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Open Window',
        click: () => {
          createWindow();
          app.dock.show();
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        click: () => {
          app.isQuittiing = true;
          app.quit();
        }
      }
    ])

    tray.setContextMenu(contextMenu);
    tray.setToolTip('Key Converter');
  }
}

ipcMain.handle('convert:engToKor', (event, word) => {
  return engToKor(word);
})

ipcMain.handle('convert:korToEng', (event, word) => {
  return korToEng(word);
})

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      app.dock.show();
    }
  })

  globalShortcut.register('CmdOrCtrl+Shift+P', autoConvert);
  globalShortcut.register('CmdOrCtrl+Shift+L', autoConvertLine);
  globalShortcut.register('CmdOrCtrl+Shift+X', autoConvertSelection);
  globalShortcut.register('CmdOrCtrl+Shift+E', engToKorSelection);
  globalShortcut.register('CmdOrCtrl+Shift+S', korToEngSelection);
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  app.dock.hide();
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
  console.log('unregistered!')
})

app.on('before-quit', () => {

  if (tray) {
    tray.destroy();
  }
})
