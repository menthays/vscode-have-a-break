import * as vscode from 'vscode';

export function getStyles(webview: vscode.Webview): string {
    return `
        body {
            margin: 0;
            padding: 20px;
            background: #f3f3f3;
            color: #333;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        .image-container {
            margin: 20px 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            background: #f0f0f0;
            position: relative;
            padding-top: 56.25%; /* 16:9 Aspect Ratio */
        }
        .image-container::before {
            content: 'Loading...';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #666;
            z-index: 1;
        }
        .image-container .loading-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: #3498db;
            transition: width 0.3s ease-out;
            z-index: 2;
        }
        .image-container img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            z-index: 3;
        }
        .image-container img.loaded {
            opacity: 1;
        }
        .quote {
            margin: 20px 0;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .quote-text {
            font-size: 24px;
            line-height: 1.4;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .quote-author {
            font-size: 16px;
            color: #7f8c8d;
        }
        .timer {
            font-size: 18px;
            color: #666;
            margin-top: 20px;
        }
        .button-container {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
        }
        button {
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            background-color: #2ecc71;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #27ae60;
        }
        button.secondary {
            background-color: #3498db;
        }
        button.secondary:hover {
            background-color: #2980b9;
        }
    `;
}
