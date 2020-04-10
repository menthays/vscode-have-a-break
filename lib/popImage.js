const vscode = require('vscode');

const _getPicture = () => {

}

const _getWebContent = (url) => {
  return `
    <!DOCTYPE html>
    <html lang="en" style="height: 100%;">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Take a break</title>
    </head>
    <body style="height: 100%;">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <img onerror="handleError()" onload="handleLoaded()" src="${url}" />
      </div>
      <script>
        function handleLoaded () {
          const vscode = acquireVsCodeApi()
          vscode.postMessage({
            event: 'photo-loaded',
          })
        }
        function handleError () {
          const vscode = acquireVsCodeApi()
          vscode.postMessage({
            event: 'photo-error',
          })
        }
      </script>
    </body>
    </html>
  `
}

let currentPanel

const popImage = (url = 'https://unsplash.it/1200/900/?random') => {
  return new Promise((resolve, reject) => {
    const columnToShowIn = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined

    if (currentPanel) {
      currentPanel.webview.html = _getWebContent(url)
      currentPanel.reveal(columnToShowIn)
    } else {
      currentPanel = vscode.window.createWebviewPanel(
        'break', // Identifies the type of the webview. Used internally
        'Take a break', // Title of the panel displayed to the user
        columnToShowIn,
        {
          retainContextWhenHidden: true,
          enableScripts: true,
        },
      )
      currentPanel.webview.onDidReceiveMessage(
        message => {
          switch (message.event) {
            default:
            case 'photo-loaded':
              resolve()
            case 'photo-error':
              reject()
          }
        }
      )
      currentPanel.webview.html = _getWebContent(url)
    }
  })
}

module.exports = {
  popImage
}