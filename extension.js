// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')

const { popImage } = require('./lib/popImage')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let timer
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.setTimer', async () => {
		clearTimeout(timer)
		const minutes = await vscode.window.showInputBox({
			value: 25,
			prompt: 'How long will next break come?'
		})
		if (!minutes) {
			return
		}
		timer = setTimeout(() => {
			vscode.window.withProgress({
				title: 'Time to have a break. Fetching photo...',
				location: 15,
			}, () => {
				return popImage()
					.then(() => {
						vscode.window.showInformationMessage('That\'s it')
						vscode.commands.executeCommand('extension.setTimer')
					}).catch(err => {
						vscode.window.showErrorMessage('There seems to be some problems')
						vscode.commands.executeCommand('extension.setTimer')
					})
			})
			
		}, Number(minutes) * 60 * 1000)
	})

	context.subscriptions.push(disposable)
	vscode.commands.executeCommand('extension.setTimer')
}
exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
