const { app, BrowserWindow, globalShortcut, clipboard, Tray, Menu } = require('electron')
const robot = require('robotjs');
const applescript = require('applescript');
// const { GlobalKeyboardListener } = require("node-global-key-listener");
const convertType = require('./convertType');
const path = require('path');
// const v = new GlobalKeyboardListener();

let win;
let tray = null;

const createWindow = () => {
  if (win) {
    win.show();
    return;
  }

  win = new BrowserWindow({
    width: 1000,
    height: 800
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
        label: 'Auto Convert',
        click: () => {
          //이대로 복사해서 감지, 변경
        }
      },
      {
        label: 'ENG to KOR in selection',
        click: () => {
          // 이대로 복사해서 engToKor 로직 돌리기
        }
      },
      {
        label: 'KOR to ENG in selection',
        click: () => {
          // 이대로 복사해서 korToEng 로직 돌리기

          // 왼쪽으로 선택한다음 복사해서
          // 마지막 단어 추출한다음 감지해서 변경하고
          // 대치해서 replace 해야함
        }
      },
      {
        label: 'Open window',
        click: () => {
          createWindow();
        }
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

    // tray.on('click', () => {
    //   createWindow();
    // })
  }
}

function isTextFieldFocused(callback) {
  const script = `
  tell application "System Events"
      tell (first application process whose frontmost is true)
          try
              set focusedElement to value of attribute "AXFocusedUIElement"
              set roleDesc to value of attribute "AXRoleDescription" of focusedElement
              if roleDesc is "text field" or roleDesc is "text entry area" then
                  return "true"
              else
                  return "false"
              end if
          on error
              return "false"
          end try
      end tell
  end tell
  `;

  applescript.execString(script, (err, result) => {
    if (err) {
      console.error("AppleScript 실행 오류:", err);
      callback(false);
    } else {
      callback(result.trim() === "true");
    }
  });
}


function replaceLastWord(text) {
  return text.replace(/(\S+)(\s*)$/, (_, lastWord, spaces) => convertType(lastWord) + spaces);
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  const ret = globalShortcut.register('CommandOrControl+E', () => {
    console.log('shortcut pressed')
    // v.addListener(event => {
    // if ((event.name === "SPACE" || event.name === "ENTER") && event.state === "UP") {
    // console.log('whitespace pressed')
    isTextFieldFocused((focused) => {
      if (!focused) {
        console.log('⚠️ 입력 필드가 포커스되지 않음! 실행 취소');
        return;
      }

      console.log('✅ 입력 필드가 포커스됨! 실행 시작');

      robot.keyTap('left', ['command', 'shift']);
      setTimeout(() => {
        robot.keyTap('c', ['command']); // 복사
      }, 50);

      setTimeout(() => {
        let text = clipboard.readText().trim();
        console.log('Clipboard Text:', text);

        if (!text) {
          console.log('⚠️ 클립보드가 비어 있음!');
          return;
        }

        let modifiedText = replaceLastWord(text);
        console.log('Modified Text:', modifiedText);
        clipboard.writeText(modifiedText);

        setTimeout(() => {
          robot.keyTap('v', ['command']); // 붙여넣기
        }, 50);
      }, 100);
    });
    // }
  });

  if (!ret) {
    console.log('registration failed')
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('will-quit', () => {
  if (globalShortcut.isRegistered('CommandOrControl+E')) {
    globalShortcut.unregister('CommandOrControl+E');
  }


  globalShortcut.unregisterAll()
  console.log('unregistered!')
})

app.on('before-quit', () => {

  if (tray) {
    tray.destroy();
  }
})
