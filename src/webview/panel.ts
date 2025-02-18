import * as vscode from 'vscode';
import { getStyles } from './styles';
import { getClientScript } from './script';
import { fetchRandomQuote } from '../services/quoteService';
import { getRandomImageUrl } from '../services/imageService';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '../constants';

// Generate webview HTML content
async function generateWebviewContent(webview: vscode.Webview): Promise<string> {
    const quote = await fetchRandomQuote();
    const imageUrl = getRandomImageUrl();

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource};">
        <title>Have a Break</title>
        <style>${getStyles(webview)}</style>
    </head>
    <body>
        <div class="container">
            <div class="image-container">
                <div class="loading-progress"></div>
                <img src="${imageUrl}" alt="Relaxing scene" 
                    onload="this.classList.add('loaded'); document.querySelector('.loading-progress').style.width = '100%';"
                    onerror="this.src='https://picsum.photos/${IMAGE_WIDTH}/${IMAGE_HEIGHT}?random=' + (new Date().getTime() + 1);"
                />
            </div>
            <div class="quote">
                <div class="quote-text">"${quote.text}"</div>
                <div class="quote-author">— ${quote.author}</div>
            </div>
            <div class="timer">Take a 5-minute break</div>
            <div class="button-container">
                <button id="backToWork">Back to Work</button>
                <button id="refresh" class="secondary">New Quote</button>
            </div>
        </div>
        <script>${getClientScript()}</script>
    </body>
    </html>`;
}

// Webview panel reference
let currentPanel: vscode.WebviewPanel | undefined = undefined;

// Update webview content
async function updateWebviewContent(panel: vscode.WebviewPanel) {
    panel.webview.html = await generateWebviewContent(panel.webview);
}

// Show or update break panel
export async function showBreakPanel() {
    const columnToShowIn = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;

    if (currentPanel) {
        await updateWebviewContent(currentPanel);
        currentPanel.reveal(columnToShowIn);
        return;
    }

    currentPanel = vscode.window.createWebviewPanel(
        'haveABreak',
        'Time for a Break!',
        columnToShowIn || vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    await updateWebviewContent(currentPanel);

    // Handle messages from the webview
    currentPanel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'close':
                    currentPanel?.dispose();
                    return;
                case 'refresh':
                    updateWebviewContent(currentPanel!);
                    return;
            }
        },
        undefined,
        []
    );

    currentPanel.onDidDispose(
        () => {
            currentPanel = undefined;
        },
        null,
        []
    );
}
