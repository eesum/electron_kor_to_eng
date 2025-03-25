const { app, BrowserWindow, globalShortcut, clipboard } = require('electron')
const robot = require('robotjs');
const applescript = require('applescript');
const { GlobalKeyboardListener } = require("node-global-key-listener");
const convertType = require('./convertType');

const v = new GlobalKeyboardListener();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 800
  })

  win.loadFile('index.html')
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
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // const ret = globalShortcut.register('CommandOrControl+E', () => {
  v.addListener(event => {
    if ((event.name === "SPACE" || event.name === "ENTER") && event.state === "UP") {
      console.log('whitespace pressed')
      isTextFieldFocused((focused) => {
        if (!focused) {
          console.log('⚠️ 입력 필드가 포커스되지 않음! 실행 취소');
          return;
        }

        console.log('✅ 입력 필드가 포커스됨! 실행 시작');

        robot.keyTap('left', ['command', 'shift']);
        setTimeout(() => {
          robot.keyTap('c', ['command']);
          setTimeout(() => {
            let text = clipboard.readText();
            console.log('Clipboard Text:', text);

            if (!text.trim()) {
              console.log('⚠️ 클립보드가 비어 있음!');
              return;
            }

            let modifiedText = replaceLastWord(text);
            console.log('Modified Text:', modifiedText);

            clipboard.writeText(modifiedText);

            setTimeout(() => {
              robot.keyTap('v', ['command']);
            }, 100);
          }, 200);
        }, 100);
      });
    }
  });

  // if (!ret) {
  //   console.log('registration failed')
  // }

  // console.log(globalShortcut.isRegistered('CommandOrControl+E'))
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// app.on('will-quit', () => {
//   console.log('unregistered!')
//   globalShortcut.unregister('CommandOrControl+E')
//   globalShortcut.unregisterAll()
// })
