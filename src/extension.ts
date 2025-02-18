import * as vscode from 'vscode';
import { DEFAULT_BREAK_INTERVAL } from './constants';
import { showBreakPanel } from './webview/panel';

// Extension activation
export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "have-a-break" is now active!');

    const breakInterval = vscode.workspace.getConfiguration('have-a-break')
        .get('breakInterval') as number || DEFAULT_BREAK_INTERVAL;

    // Register commands
    const startBreakCommand = vscode.commands.registerCommand(
        'have-a-break.startBreak',
        showBreakPanel
    );

    context.subscriptions.push(startBreakCommand);

    // Set up break reminder
    const interval = breakInterval * 60 * 1000; // Convert minutes to milliseconds
    const timer = setInterval(showBreakPanel, interval);

    // Clean up
    context.subscriptions.push({
        dispose: () => {
            clearInterval(timer);
        }
    });
}

// Extension deactivation
export function deactivate() {}